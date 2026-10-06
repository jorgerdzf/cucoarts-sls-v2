import React, { useRef, useState } from 'react';
import { Copy, Lang } from './copy';
import { checkFiles, sendRequest, SendResult } from './api';

// Piezas compartidas por los formularios de la landing y el asistente de murales.

export const WA = '528120321492';
export const MAIL = 'hello@cucoarts.com';

export type Vals = Record<string, string>;
export type Status = 'idle' | 'sending' | 'sent' | 'failed';

export function FilePicker({ c, hint, files, onChange }: { c: Copy; hint: string; files: File[]; onChange: (f: File[]) => void }) {
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const pick = (list: FileList | null) => {
    const next = [...files, ...Array.from(list || [])];
    const problem = checkFiles(next);
    if (problem) { setErr(c.files[problem]); } else { setErr(''); onChange(next); }
    if (input.current) input.current.value = '';
  };
  const remove = (i: number) => { setErr(''); onChange(files.filter((_, k) => k !== i)); };
  return (
    <div className="cl-full cl-files">
      <span className="cl-flabel">{c.files.label}</span>
      <p className="cl-note">{hint}</p>
      <button type="button" className="cl-btn" onClick={() => input.current?.click()}>{c.files.choose}</button>
      <input ref={input} type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx,.zip" onChange={e => pick(e.target.files)} />
      {err && <p className="cl-ferr" role="alert">{err}</p>}
      {files.length > 0 && (
        <ul>{files.map((f, i) => (
          <li key={f.name + i}><span>{f.name}</span><small>{Math.max(1, Math.round(f.size / 1024))} KB</small>
            <button type="button" className="cl-linkbtn" onClick={() => remove(i)}>{c.files.remove}</button></li>
        ))}</ul>
      )}
    </div>
  );
}

export const Honeypot = () => (
  <div className="cl-hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
);

export function Fallback({ c, summary, subject, onEdit }: { c: Copy; summary: string; subject: string; onEdit: () => void }) {
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(summary)}`;
  const mail = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); } catch (e) { /* sin portapapeles */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="cl-done">
      <p className="cl-err">{c.status.failed}</p>
      <pre className="cl-sum">{summary}</pre>
      <p className="cl-note">{c.status.attachNote}</p>
      <div className="cl-actions">
        <a className="cl-btn cl-primary" href={wa} target="_blank" rel="noopener noreferrer">{c.done.wa}</a>
        <a className="cl-btn" href={mail}>{c.done.mail}</a>
        <button type="button" className="cl-btn" onClick={copy}>{copied ? c.done.copied : c.done.copy}</button>
        <button type="button" className="cl-btn cl-ghost" onClick={onEdit}>{c.done.edit}</button>
      </div>
    </div>
  );
}

export function Sent({ c, result, text, onAgain }: { c: Copy; result: SendResult | null; text: string; onAgain: () => void }) {
  return (
    <div className="cl-done cl-sent" role="status">
      <h4>{c.status.sentTitle}</h4>
      <p>{text}</p>
      {result && <p className="cl-note">{c.status.folio}: <b>{result.id}</b></p>}
      <div className="cl-actions"><button type="button" className="cl-btn" onClick={onAgain}>{c.status.again}</button></div>
    </div>
  );
}

/* Flujo común de envío: manda al servidor y, si falla, deja el mensaje listo para WhatsApp/correo. */
export function useSender(lang: Lang) {
  const [vals, setVals] = useState<Vals | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<SendResult | null>(null);
  const send = async (type: 'quote' | 'sell', v: Vals, summary: string) => {
    setVals(v); setStatus('sending');
    try { setResult(await sendRequest({ type, lang, values: v, summary, files })); setStatus('sent'); }
    catch (e) { setStatus('failed'); }
  };
  const reset = (full: boolean) => { setVals(null); setStatus('idle'); if (full) { setFiles([]); setResult(null); } };
  return { vals, files, setFiles, status, result, send, reset };
}

