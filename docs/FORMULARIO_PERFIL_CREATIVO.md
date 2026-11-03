# Formulario de perfil creativo (cucoarts.com/formulario)

Página única y reutilizable: `frontend/public/formulario` (archivo sin extensión, igual que `/rob`).
Se abre con `cucoarts.com/formulario?a=<artista>` y no está indexada (`noindex` + `Disallow` en robots.txt).

## Cómo agregar a otro artista (sin tocar código)

1. Copia `bluewave.json` como `<artista>.json` (la clave: solo minúsculas, números y guiones).
2. Cambia `titulo`, `intro`, `whatsapp` y `prellenado` (solo datos comprobados).
3. Si es otra disciplina, crea otra plantilla en `plantillas/<nombre>.json` (copia `musica-eventos.json`) y ponla en `plantilla`.
4. Para cambiar un texto de una pregunta solo para ese artista: `ajustes` → `{"seccion.campo": {"help": "...", "label": "..."}}`.
5. Publica (ver abajo) y manda `cucoarts.com/formulario?a=<artista>`.

## Formato de una plantilla

`secciones[]` con `id`, `titulo`, `intro` y `campos[]` (`id`, `label`, `type`, `help`, `opts`).
Tipos: `text`, `tel`, `email`, `url`, `area`, `sel`, `opts` (varias casillas), `chk`.
`repetible` = bloque que se agrega varias veces (integrantes, paquetes). `archivos: true` muestra la lista de `archivos[]`
de la plantilla; `autorizacion: true` marca la sección de consentimientos (el campo `c_uso` es el que revisa la pantalla final).

## Qué pasa al enviar

`POST requests` con `type: "perfil"` → se guarda en DynamoDB (`dev-cucoarts-requests`, con las respuestas completas en JSON en
`values.datos`) y llega correo a roberto@cucoarts.com con el texto completo. Archivos adjuntos: hasta 4, 5 MB c/u, 7 MB en total
(mismo servidor que `/rob`). Lógica y pruebas: `backend/lambda/requests/index.js` y `test.local.js`.

## Publicar

Cambios en `backend/` requieren `serverless deploy --stage dev --nos3sync` (con `NODE_OPTIONS=--no-experimental-require-module`);
los cambios en `frontend/public/` salen con `serverless s3sync` + invalidación de CloudFront. Ver la skill `deploy-cucoarts`.

## Guardar y retomar el avance (borradores)

- Cada visitante tiene una clave personal larga en el enlace: `cucoarts.com/formulario?a=<artista>&k=<clave>`. La genera el navegador la primera vez
  (si el enlace no trae `k`, reutiliza la última de ese dispositivo o crea una nueva y la agrega a la dirección).
- Al escribir se guarda al instante en el dispositivo y, ~2.5 s después, en el servidor (`POST requests/draft`). Quien abre el mismo enlace en otro
  dispositivo lo retoma (`POST requests/draft/load`). Si hay dos versiones gana la más reciente (`_t`); no hay edición simultánea.
- **Para que Roberto vea el avance de alguien:** abrir el formulario, copiar el enlace personal (botón "Copiar mi enlace") y mandárselo a la persona.
  Quien tenga ese enlace ve y edita las respuestas: no compartirlo.
- Los borradores viven en la misma tabla (`type: borrador`, id `draft-<clave>`) con atributo TTL `expira` a 90 días desde el último guardado.
  Las solicitudes enviadas (`type: perfil`) no llevan `expira` y no se borran solas. Máximo 100,000 caracteres por borrador.
- Si no hay conexión, el avance queda en el dispositivo y se reintenta en el siguiente cambio.
- Pruebas: `backend/lambda/requests/test.local.js` (tabla simulada).
