'use strict';

/* Acceso a DynamoDB de /mty (una sola tabla). Claves:
 *   p#<destino>   | <fecha ISO>#<folio>   copia pública de lo aprobado (sin contacto)
 *   s#<destino>   | <fecha ISO>#<folio>   envíos (check-in / recomendación / sugerencia) con su estado y su contacto (privado)
 *   d#<destino>   | <huella>              "ya participaste" (evita votos repetidos)
 *   c#mail        | <día>                 contador de correos del día
 *   agg           | <destino>             promedios (solo cuenta lo aprobado)
 *   agg           | h#<destino>           contador de "voy a ir" (hype) de un evento
 *   d#h#<destino> | <huella>              "ya dije que voy" (una vez por dispositivo)
 *   agg           | l#<destino>           contador de "me gusta" de un lugar
 *   d#l#<destino> | <huella>              "ya dio like" (una vez por dispositivo y lugar)
 *   c#ip          | <huella ip+destino>   cuántos dispositivos distintos votaron desde una misma IP
 * Estados: pendiente -> aprobado | rechazado (info = sugerencias, solo informativas).
 * `expira` borra solo: pendientes a los 90 días, rechazados a los 30, huellas a los 365, contador a los 2. */

const DAY = 86400;
const TTL = { like: 365 * DAY, pendiente: 90 * DAY, rechazado: 30 * DAY, huella: 365 * DAY, contador: 2 * DAY, info: 90 * DAY };

const S = (v) => ({ S: String(v) });
const N = (v) => ({ N: String(v) });

function plain(av) {
  const o = {};
  for (const [k, v] of Object.entries(av || {})) o[k] = v.S !== undefined ? v.S : v.N !== undefined ? Number(v.N) : v.BOOL;
  return o;
}

function makeStore({ ddb, table, C }) {
  const send = (cmd) => ddb.send(cmd);
  const isCond = (e) => e && (e.name === 'ConditionalCheckFailedException' || e.name === 'TransactionCanceledException');

  async function reserveDedupe(target, hash, nowSec) {
    try {
      await send(new C.PutItemCommand({
        TableName: table,
        Item: { pk: S('d#' + target), sk: S(hash), expira: N(nowSec + TTL.huella) },
        ConditionExpression: 'attribute_not_exists(pk)',
      }));
      return true;
    } catch (e) { if (isCond(e)) return false; throw e; }
  }

  async function releaseDedupe(target, hash) {
    await send(new C.DeleteItemCommand({ TableName: table, Key: { pk: S('d#' + target), sk: S(hash) } }));
  }

  /* Tope de dispositivos distintos por IP y destino: frena a quien invente identificadores para inflar el contador. */
  async function bumpIp(key, max, nowSec) {
    try {
      await send(new C.UpdateItemCommand({
        TableName: table, Key: { pk: S('c#ip'), sk: S(key) },
        UpdateExpression: 'ADD n :one SET expira = :t', ConditionExpression: 'attribute_not_exists(n) OR n < :max',
        ExpressionAttributeValues: { ':one': N(1), ':t': N(nowSec + TTL.huella), ':max': N(max) },
      }));
      return true;
    } catch (e) { if (isCond(e)) return false; throw e; }
  }

  async function addLike(ref) {
    const r = await send(new C.UpdateItemCommand({
      TableName: table, Key: { pk: S('agg'), sk: S('l#' + ref) },
      UpdateExpression: 'ADD n :one', ExpressionAttributeValues: { ':one': N(1) }, ReturnValues: 'UPDATED_NEW',
    }));
    return Number(r.Attributes.n.N);
  }

  async function addHype(ref) {
    const r = await send(new C.UpdateItemCommand({
      TableName: table, Key: { pk: S('agg'), sk: S('h#' + ref) },
      UpdateExpression: 'ADD n :one', ExpressionAttributeValues: { ':one': N(1) }, ReturnValues: 'UPDATED_NEW',
    }));
    return Number(r.Attributes.n.N);
  }

  async function bumpMail(day, nowSec) {
    const r = await send(new C.UpdateItemCommand({
      TableName: table, Key: { pk: S('c#mail'), sk: S(day) },
      UpdateExpression: 'ADD n :one SET expira = :t', ExpressionAttributeValues: { ':one': N(1), ':t': N(nowSec + TTL.contador) },
      ReturnValues: 'UPDATED_NEW',
    }));
    return Number(r.Attributes.n.N);
  }

  async function putSubmission(target, id, item, estado, nowIso, nowSec) {
    const sk = nowIso + '#' + id;
    const it = { pk: S('s#' + target), sk: S(sk), id: S(id), estado: S(estado), tipo: S(item.tipo), creado: S(nowIso), expira: N(nowSec + TTL[estado]) };
    for (const [k, v] of Object.entries(item)) {
      if (v === '' || v === undefined || v === null) continue;
      it[k] = typeof v === 'number' ? N(v) : S(v);
    }
    await send(new C.PutItemCommand({ TableName: table, Item: it, ConditionExpression: 'attribute_not_exists(pk)' }));
    return { pk: 's#' + target, sk };
  }

  async function getSubmission(pk, sk) {
    const r = await send(new C.GetItemCommand({ TableName: table, Key: { pk: S(pk), sk: S(sk) } }));
    return r.Item ? plain(r.Item) : null;
  }

  /* Cambia el estado una sola vez. Devuelve 'ok' | 'already' | 'missing'. Al aprobar un check-in suma al promedio en la misma transacción. */
  async function decide(pk, sk, approve, nowIso, nowSec) {
    const cur = await getSubmission(pk, sk);
    if (!cur || !pk.startsWith('s#')) return { status: 'missing' };
    if (cur.estado !== 'pendiente') return { status: 'already', estado: cur.estado };
    const key = { pk: S(pk), sk: S(sk) };
    const names = { '#e': 'estado' };
    try {
      if (approve) {
        const tx = [{ Update: {
          TableName: table, Key: key, ConditionExpression: '#e = :p',
          UpdateExpression: 'SET #e = :a, decidido = :d REMOVE expira', ExpressionAttributeNames: names,
          ExpressionAttributeValues: { ':p': S('pendiente'), ':a': S('aprobado'), ':d': S(nowIso) },
        } }];
        const pubItem = { pk: S('p#' + pk.slice(2)), sk: S(sk), tipo: S(cur.tipo) };
        ['ref', 'comentario', 'alias', 'social', 'link', 'nombre', 'disciplina', 'zona', 'porque'].forEach((f) => { if (cur[f]) pubItem[f] = S(cur[f]); });
        if (cur.estrellas) pubItem.estrellas = N(cur.estrellas);
        tx.push({ Put: { TableName: table, Item: pubItem } });
        if (cur.tipo === 'checkin') tx.push({ Update: {
          TableName: table, Key: { pk: S('agg'), sk: S(cur.ref) },
          UpdateExpression: 'ADD n :one, sm :st', ExpressionAttributeValues: { ':one': N(1), ':st': N(cur.estrellas) },
        } });
        await send(new C.TransactWriteItemsCommand({ TransactItems: tx }));
      } else {
        await send(new C.UpdateItemCommand({
          TableName: table, Key: key, ConditionExpression: '#e = :p',
          UpdateExpression: 'SET #e = :r, decidido = :d, expira = :t', ExpressionAttributeNames: names,
          ExpressionAttributeValues: { ':p': S('pendiente'), ':r': S('rechazado'), ':d': S(nowIso), ':t': N(nowSec + TTL.rechazado) },
        }));
      }
      return { status: 'ok', item: cur };
    } catch (e) { if (isCond(e)) return { status: 'already' }; throw e; }
  }

  /* Lo aprobado se copia (sin contacto) a la partición p#<destino>: así se lee sin filtrar y los pendientes no pueden taparlo. */
  async function listApproved(target, limit = 50) {
    const r = await send(new C.QueryCommand({
      TableName: table, KeyConditionExpression: 'pk = :pk', ExpressionAttributeValues: { ':pk': S('p#' + target) }, ScanIndexForward: false, Limit: limit,
    }));
    return (r.Items || []).map(plain);
  }

  async function listAgg() {
    const r = await send(new C.QueryCommand({ TableName: table, KeyConditionExpression: 'pk = :pk', ExpressionAttributeValues: { ':pk': S('agg') } }));
    const out = {};
    (r.Items || []).map(plain).forEach((x) => {
      if (x.sk.startsWith('h#') || x.sk.startsWith('l#')) { const ref = x.sk.slice(2); out[ref] = Object.assign(out[ref] || { n: 0, sum: 0 }, x.sk[0] === 'h' ? { h: x.n || 0 } : { l: x.n || 0 }); }
      else out[x.sk] = Object.assign({ n: x.n || 0, sum: x.sm || 0 }, out[x.sk] && out[x.sk].h ? { h: out[x.sk].h } : {}, out[x.sk] && out[x.sk].l ? { l: out[x.sk].l } : {});
    });
    return out;
  }

  return { reserveDedupe, releaseDedupe, bumpIp, addHype, addLike, bumpMail, putSubmission, getSubmission, decide, listApproved, listAgg };
}

module.exports = { makeStore, TTL, plain };
