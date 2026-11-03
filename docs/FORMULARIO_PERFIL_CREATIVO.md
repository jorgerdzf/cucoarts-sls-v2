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
