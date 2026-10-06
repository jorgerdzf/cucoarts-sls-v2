import React, { useEffect } from 'react'
import { applySeo } from '../landing/seo'
import './privacy.css'

// Aviso de privacidad de CUCO ARTS (persona moral). Actualizado el 5 de octubre de 2026.
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
      'Artistas que piden entrar a la tienda mediante el formulario de registro de cucoarts.com: nombre, correo, Instagram, portafolio con precios, la opción de ingreso que elijan, lo que ofrecen a cambio si piden condonación o colaboración, y los archivos que nos envíen (por ejemplo, CV o colección en venta).',
      'Personas que piden una cotización artística (murales y artes plásticas): nombre, WhatsApp, correo, los datos de la obra que quieren (tipo, medidas, ciudad, presupuesto, fecha e idea) y los archivos de referencia que nos envíen.',
      'Asistentes a nuestros eventos y exposiciones: su imagen, cuando aparecen en fotos o videos del evento.',
    ],
    cierre: [
      'No solicitamos datos personales sensibles; te pedimos no incluirlos en tus mensajes ni en los archivos que nos envíes. Los datos bancarios de artistas solo se usan para pagarles y los tratamos con su consentimiento expreso.',
    ],
  },
  {
    titulo: '3. ¿Para qué los usamos?',
    parrafos: ['Finalidades necesarias para la relación que tienes con nosotros:'],
    lista: [
      'Atender tus mensajes, dudas y solicitudes.',
      'Procesar, enviar y dar seguimiento a tus compras.',
      'Dar de alta a artistas, publicar su perfil y su obra, y pagarles sus ventas.',
      'Revisar las solicitudes de artistas que quieren vender en la tienda, contactarlos y, en su caso, proponerles el paquete de registro o un acuerdo de trabajo.',
      'Preparar cotizaciones de obra por encargo y conectar a quien las pide con artistas del catálogo.',
      'Organizar exposiciones, activaciones y eventos.',
      'Emitir facturas y cumplir obligaciones legales y fiscales.',
    ],
    cierre: [
      'Finalidades opcionales: enviarte novedades, promociones y encuestas (incluidas las noticias de la tienda, si marcaste esa casilla en un formulario), y publicar en nuestras redes fotos o videos de eventos donde apareces. Si no quieres que usemos tus datos para estas finalidades, escríbenos a ' + CORREO + '. Negarte no afecta tus compras ni los servicios que te damos.',
    ],
  },
  {
    titulo: '4. ¿Con quién los compartimos?',
    parrafos: ['No vendemos tus datos. Solo los compartimos cuando es necesario:'],
    lista: [
      'Con los artistas, cuando hace falta para entregar una obra o un encargo.',
      'Con empresas de paquetería, para enviarte tus pedidos.',
      'Con los proveedores de tecnología que usamos para operar: Shopify y sus procesadores de pago (tienda en línea), Google (correo, almacenamiento y Google Analytics), EmailJS (envío del formulario de contacto) y Amazon Web Services (hospedaje del sitio, almacenamiento seguro de las solicitudes y de los archivos que nos envías, y envío de los avisos por correo).',
      'Con autoridades, cuando la ley lo exige.',
    ],
  },
  {
    titulo: '5. ¿Cuánto tiempo conservamos tus datos?',
    parrafos: [
      'Conservamos las solicitudes que nos envías por los formularios mientras sean necesarias para atenderlas y para cumplir obligaciones legales y fiscales. Los archivos que subes se eliminan de nuestro almacenamiento a los 180 días; las copias que lleguen a nuestro correo se conservan en el buzón mientras hagan falta.',
      `Si quieres que borremos tu solicitud o tus archivos antes, escríbenos a ${CORREO}.`,
    ],
  },
  {
    titulo: '6. Tus derechos (ARCO), revocación y límites de uso',
    parrafos: [
      `Puedes pedir acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso, revocar tu consentimiento o limitar el uso de tus datos. Envía tu solicitud a ${CORREO} con tu nombre, un medio para responderte, el derecho que quieres ejercer y sobre qué datos, y una copia de tu identificación o la de tu representante.`,
      'Te respondemos en un plazo máximo de 20 días hábiles. Si tu solicitud procede, la aplicamos dentro de los 15 días hábiles siguientes.',
    ],
  },
  {
    titulo: '7. Fotos y videos de eventos',
    parrafos: [
      `En nuestros eventos tomamos fotos y videos que podemos publicar en el sitio y en redes. Si apareces en alguno y prefieres que lo retiremos, escríbenos a ${CORREO}.`,
    ],
  },
  {
    titulo: '8. Cookies y medición',
    parrafos: [
      'Usamos Google Analytics para medir de forma estadística cómo se usa el sitio. Puedes borrar o bloquear las cookies desde la configuración de tu navegador.',
    ],
  },
  {
    titulo: '9. Personas fuera de México',
    parrafos: [
      `Si vives fuera de México, por ejemplo en la Unión Europea, puedes ejercer los mismos derechos escribiendo a ${CORREO}.`,
    ],
  },
  {
    titulo: '10. Cambios a este aviso',
    parrafos: [
      'Si este aviso cambia, publicaremos la versión nueva en cucoarts.com/privacidad con su fecha de actualización.',
      'Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la autoridad competente en la materia.',
    ],
  },
]

const FECHA_ALTA = '31 de marzo de 2023'
const FECHA_ACT = '5 de octubre de 2026'

// El modo día / noche comparte la llave "cucoarts-theme" con la landing y /rob.
function usePageTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-page', 'privacy')
    try {
      const t = localStorage.getItem('cucoarts-theme')
      if (t === 'dark' || t === 'light') root.dataset.theme = t
    } catch (e) { /* sin almacenamiento */ }
    return () => { root.removeAttribute('data-page'); delete root.dataset.theme }
  }, [])
}

export default function PrivacyNotice() {
  usePageTheme()
  useEffect(() => applySeo('privacy', 'es'), [])
  return (
    <main className='pv'>
      <header className='pv-hero'>
        <div className='pv-in'>
          <div className='pv-corners' aria-hidden='true'><span>CUCOARTS</span><a href='/'>Volver al inicio</a></div>
          <h1>Aviso de privacidad</h1>
          <p className='pv-dates'>Fecha de alta en el sitio: {FECHA_ALTA} · Última actualización: {FECHA_ACT}</p>
        </div>
      </header>
      <div className='pv-in pv-body'>
        {SECCIONES.map((sec) => {
          const m = /^(\d+)\.\s*(.*)$/.exec(sec.titulo)
          return (
            <section className='pv-sec' key={sec.titulo}>
              <h2><span className='pv-n'>{m ? m[1].padStart(2, '0') : ''}</span>{m ? m[2] : sec.titulo}</h2>
              <div className='pv-text'>
                {sec.parrafos?.map((p) => <p key={p}>{p}</p>)}
                {sec.lista && <ul>{sec.lista.map((item) => <li key={item}>{item}</li>)}</ul>}
                {sec.cierre?.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
