import { Grid, Typography } from '@mui/material'
import React from 'react'

// Aviso de privacidad de CUCO ARTS (persona moral). Actualizado el 2 de octubre de 2026.
// El texto vive en SECCIONES para que sea fácil de mantener; revisar con un abogado antes de publicar cambios.

type Seccion = { titulo: string; parrafos?: string[]; lista?: string[]; cierre?: string[] }

const CORREO = 'hello@cucoarts.com'

const SECCIONES: Seccion[] = [
  {
    titulo: '1. ¿Quién es responsable de tus datos?',
    parrafos: [
      'CUCO Cultural Collective México, S. de R.L. de C.V. ("CUCO ARTS"), con domicilio en Eden 7714, Col. Cumbres Providencia, Monterrey, Nuevo León, C.P. 64346, es responsable del tratamiento de los datos personales que recaba a través de cucoarts.com, su tienda en línea (store.cucoarts.com), sus redes sociales y sus exposiciones y activaciones.',
      `Para cualquier tema de privacidad escríbenos a ${CORREO}.`,
      'Los servicios de producción que Roberto Escobedo ofrece como persona física en cucoarts.com/rob tienen su propio aviso de privacidad, publicado en esa página.',
    ],
  },
  {
    titulo: '2. ¿Qué datos recabamos?',
    lista: [
      'Clientes y compradores: nombre, teléfono, correo, domicilio de entrega y, si pides factura, tus datos fiscales.',
      'Artistas que forman parte del catálogo: nombre, datos de contacto, perfil artístico, imágenes de su obra, datos de facturación y datos bancarios para pagarles sus ventas.',
      'Personas que nos escriben por el formulario de contacto o redes sociales: nombre, correo y el mensaje que nos envían.',
      'Asistentes a nuestros eventos y exposiciones: su imagen, cuando aparecen en fotos o videos del evento.',
    ],
    cierre: [
      'No solicitamos datos personales sensibles. Los datos bancarios de artistas solo se usan para pagarles y los tratamos con su consentimiento expreso.',
    ],
  },
  {
    titulo: '3. ¿Para qué los usamos?',
    parrafos: ['Finalidades necesarias para la relación que tienes con nosotros:'],
    lista: [
      'Atender tus mensajes, dudas y solicitudes.',
      'Procesar, enviar y dar seguimiento a tus compras.',
      'Dar de alta a artistas, publicar su perfil y su obra, y pagarles sus ventas.',
      'Organizar exposiciones, activaciones y eventos.',
      'Emitir facturas y cumplir obligaciones legales y fiscales.',
    ],
    cierre: [
      'Finalidades opcionales: enviarte novedades, promociones y encuestas, y publicar en nuestras redes fotos o videos de eventos donde apareces. Si no quieres que usemos tus datos para estas finalidades, escríbenos a ' + CORREO + '. Negarte no afecta tus compras ni los servicios que te damos.',
    ],
  },
  {
    titulo: '4. ¿Con quién los compartimos?',
    parrafos: ['No vendemos tus datos. Solo los compartimos cuando es necesario:'],
    lista: [
      'Con los artistas, cuando hace falta para entregar una obra o un encargo.',
      'Con empresas de paquetería, para enviarte tus pedidos.',
      'Con los proveedores de tecnología que usamos para operar: Shopify y sus procesadores de pago (tienda en línea), Google (correo, almacenamiento y Google Analytics), EmailJS (envío del formulario de contacto) y Amazon Web Services (hospedaje del sitio).',
      'Con autoridades, cuando la ley lo exige.',
    ],
  },
  {
    titulo: '5. Tus derechos (ARCO), revocación y límites de uso',
    parrafos: [
      `Puedes pedir acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso, revocar tu consentimiento o limitar el uso de tus datos. Envía tu solicitud a ${CORREO} con tu nombre, un medio para responderte, el derecho que quieres ejercer y sobre qué datos, y una copia de tu identificación o la de tu representante.`,
      'Te respondemos en un plazo máximo de 20 días hábiles. Si tu solicitud procede, la aplicamos dentro de los 15 días hábiles siguientes.',
    ],
  },
  {
    titulo: '6. Fotos y videos de eventos',
    parrafos: [
      `En nuestros eventos tomamos fotos y videos que podemos publicar en el sitio y en redes. Si apareces en alguno y prefieres que lo retiremos, escríbenos a ${CORREO}.`,
    ],
  },
  {
    titulo: '7. Cookies y medición',
    parrafos: [
      'Usamos Google Analytics para medir de forma estadística cómo se usa el sitio. Puedes borrar o bloquear las cookies desde la configuración de tu navegador.',
    ],
  },
  {
    titulo: '8. Personas fuera de México',
    parrafos: [
      `Si vives fuera de México, por ejemplo en la Unión Europea, puedes ejercer los mismos derechos escribiendo a ${CORREO}.`,
    ],
  },
  {
    titulo: '9. Cambios a este aviso',
    parrafos: [
      'Si este aviso cambia, publicaremos la versión nueva en cucoarts.com/privacidad con su fecha de actualización.',
      'Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la autoridad competente en la materia.',
    ],
  },
]

export default function PrivacyNotice() {
  return (
    <Grid container justifyContent='center'>
      <Grid item xs={11} md={8} pt={4} pb={6} textAlign='left'>
        <Typography variant='h3' component='h1'>
          <b>Aviso de Privacidad</b>
        </Typography>
        <Typography variant='caption' display='block' mt={1}>
          Fecha de alta en el sitio: 31 de marzo de 2023 · Última actualización: 2 de octubre de 2026
        </Typography>
        {SECCIONES.map((s) => (
          <section key={s.titulo}>
            <Typography variant='h6' component='h2' mt={4} mb={1}>
              <b>{s.titulo}</b>
            </Typography>
            {s.parrafos?.map((p) => (
              <Typography variant='body2' paragraph key={p}>{p}</Typography>
            ))}
            {s.lista && (
              <ul style={{ margin: '0 0 16px', paddingLeft: '1.2em' }}>
                {s.lista.map((item) => (
                  <li key={item}><Typography variant='body2'>{item}</Typography></li>
                ))}
              </ul>
            )}
            {s.cierre?.map((p) => (
              <Typography variant='body2' paragraph key={p}>{p}</Typography>
            ))}
          </section>
        ))}
      </Grid>
    </Grid>
  )
}
