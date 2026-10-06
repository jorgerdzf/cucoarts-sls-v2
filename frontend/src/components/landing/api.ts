import { apiEndpoint, apiKey } from '../../constants/settings';

// Cliente del servidor de solicitudes (backend/lambda/requests). Sube los archivos a S3 con URLs firmadas y luego manda la solicitud.

export const FILE_LIMITS = {
  maxFiles: 4,
  maxFile: 5 * 1024 * 1024,
  maxTotal: 7 * 1024 * 1024,
  ext: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'doc', 'docx', 'zip'],
};

export type RequestType = 'quote' | 'sell';
export type SendResult = { ok: true; id: string; emailed: boolean };

const base = () => (apiEndpoint || '').replace(/\/?$/, '/');
const extOf = (n: string) => (n.split('.').pop() || '').toLowerCase();

/** Revisa la lista de archivos; devuelve la clave del mensaje de error o null. */
export function checkFiles(files: File[]): 'errCount' | 'errSize' | 'errType' | null {
  if (files.length > FILE_LIMITS.maxFiles) return 'errCount';
  if (files.some(f => !FILE_LIMITS.ext.includes(extOf(f.name)))) return 'errType';
  if (files.some(f => f.size <= 0 || f.size > FILE_LIMITS.maxFile) || files.reduce((s, f) => s + f.size, 0) > FILE_LIMITS.maxTotal) return 'errSize';
  return null;
}

async function post(path: string, body: unknown) {
  if (!apiEndpoint) throw new Error('sin endpoint');
  const res = await fetch(base() + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || `http ${res.status}`);
  return json;
}

export async function sendRequest(args: { type: RequestType; lang: string; values: Record<string, string>; summary: string; files: File[] }): Promise<SendResult> {
  const { type, lang, values, summary, files } = args;
  let uploaded: { key: string }[] = [];
  if (files.length) {
    const { uploads } = await post('requests/upload-url', { files: files.map(f => ({ name: f.name, size: f.size, type: f.type })) });
    await Promise.all((uploads as { key: string; url: string; type: string }[]).map(async (u, i) => {
      const res = await fetch(u.url, { method: 'PUT', headers: { 'Content-Type': u.type }, body: files[i] });
      if (!res.ok) throw new Error(`subida ${res.status}`);
    }));
    uploaded = (uploads as { key: string }[]).map(u => ({ key: u.key }));
  }
  const { website, ...clean } = values;
  return post('requests', { type, lang, values: clean, summary, files: uploaded, website: website || '' });
}
