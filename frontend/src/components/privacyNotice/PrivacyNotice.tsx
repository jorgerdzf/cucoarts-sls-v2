import React, { useEffect } from 'react'
import { applySeo } from '../landing/seo'
import './privacy.css'

// Aviso de privacidad de CUCO ARTS (persona moral). Actualizado el 9 de noviembre de 2026 (MTY VS ART; revisión del abogado pendiente).
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
      'Personas que juegan MTY VS ART (cucoarts.com/mty_vs_art) y reclaman su usuario: tu usuario de Instagram, el nombre público que quieras mostrar, la categoría que elijas dentro de la comunidad (por ejemplo artista, amante del arte, estudiante, institución o galería), un correo o WhatsApp (opcional), el código de verificación que te asignamos, los eventos que compartes desde cucoarts.com, tu puntaje y tu rango.',
      'Cuentas públicas de Instagram, Facebook y X que publican de forma abierta sobre un evento de artes visuales o etiquetan a CUCO ARTS, aunque no se hayan registrado: el usuario, la liga a la publicación, la fecha y los números que cualquier persona puede ver (me gusta, comentarios y compartidos). No guardamos mensajes privados, contraseñas ni listas de seguidores de esas cuentas.',
      'Cuentas públicas de medios, organizaciones y creadores de artes visuales de Monterrey a las que les escribimos un mensaje directo desde @cucoarts: el usuario de la cuenta, la fecha del mensaje, tu respuesta y, si nos lo das, tu correo.',
      'Personas que participan en la agenda cultural cucoarts.com/mty (check-in, calificación, comentario, recomendación o sugerencia de edición): correo o WhatsApp, calificación, comentario, nombre o alias, su red social y la liga a su contenido, según lo que decidan compartir. No recibimos archivos en la agenda: solo ligas.',
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
      'Recibir y revisar lo que envías a la agenda cucoarts.com/mty y, si lo aprobamos, publicarlo; y contactarte solo sobre ese envío.',
      'Verificar que el usuario de Instagram que reclamas en MTY VS ART es tuyo, llevar tu puntaje y rango, y mostrar la clasificación pública del juego.',
      'Calcular el puntaje de los eventos y de la comunidad de MTY VS ART con publicaciones abiertas, sin mostrar de forma individual a quien no se ha registrado.',
      'Emitir facturas y cumplir obligaciones legales y fiscales.',
    ],
    cierre: [
      'Finalidades opcionales: invitarte y recomendarte eventos y artes visuales, y avisarte de retos y colaboraciones de MTY VS ART, cuando nos das tu correo o WhatsApp para eso; escribirte un solo mensaje directo desde @cucoarts si tu cuenta pública comparte arte visual de Monterrey, para preguntarte si quieres recibir un boletín de eventos y recomendaciones, y enviarte ese boletín solo si respondes que sí y nos das tu correo; enviarte novedades, promociones y encuestas (incluidas las noticias de la tienda, si marcaste esa casilla en un formulario), y publicar en nuestras redes fotos o videos de eventos donde apareces. Si no quieres que usemos tus datos para estas finalidades, escríbenos a ' + CORREO + '. Negarte no afecta tus compras ni los servicios que te damos.',
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
      'Con cualquier persona que visite la agenda cucoarts.com/mty, pero solo lo que apruebas publicar: tu comentario, calificación, alias, red social y liga (nunca tu correo ni tu WhatsApp).',
      'Con cualquier persona que visite MTY VS ART, la clasificación pública: tu usuario de Instagram, tu nombre público (si lo pones), tu categoría, tu puntaje y tu rango, solo si te registraste y verificamos tu cuenta (puedes pedir que te mostremos con un alias en lugar de tu usuario). De quien no se ha registrado no mostramos el usuario ni el puntaje individual con su nombre; nunca mostramos tu correo, tu WhatsApp ni tu código de verificación.',
      'Con proveedores que pueden guardar o tratar datos fuera de México (Amazon Web Services, Google y Meta/Instagram), bajo sus propias condiciones y avisos de privacidad.',
    ],
  },
  {
    titulo: '5. ¿Cuánto tiempo conservamos tus datos?',
    parrafos: [
      'Conservamos las solicitudes que nos envías por los formularios mientras sean necesarias para atenderlas y para cumplir obligaciones legales y fiscales. Los archivos que subes se eliminan de nuestro almacenamiento a los 180 días; las copias que lleguen a nuestro correo se conservan en el buzón mientras hagan falta.',
      `Si quieres que borremos tu solicitud o tus archivos antes, escríbenos a ${CORREO}.`,
      'Lo que envías a la agenda cucoarts.com/mty se guarda mientras la agenda esté activa; si lo apruebas para publicación, sigue visible hasta que pidas retirarlo.',
      'En MTY VS ART, las solicitudes de reclamar un usuario que no se verifican se eliminan a los 90 días y las rechazadas a los 30. Una vez verificado, guardamos tu usuario, tu nombre público y tu puntaje mientras participes o hasta que pidas retirarlos; tu correo o WhatsApp lo borramos cuando lo pidas. Los puntajes se reinician cada mes y conservamos el historial mensual solo con totales por evento, sin usuarios de Instagram de quien no se registró.',
      'Si te escribimos un mensaje directo y no respondes, borramos el registro de ese mensaje a los 90 días. Si respondes que no quieres recibir más, guardamos solo tu usuario en una lista de no contactar para respetar tu decisión.',
    ],
  },
  {
    titulo: '6. Tus derechos (ARCO), revocación y límites de uso',
    parrafos: [
      `Puedes pedir acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso, revocar tu consentimiento o limitar el uso de tus datos. Envía tu solicitud a ${CORREO} con tu nombre, un medio para responderte, el derecho que quieres ejercer y sobre qué datos, y una copia de tu identificación o la de tu representante.`,
      'Te respondemos en un plazo máximo de 20 días hábiles. Si tu solicitud procede, la aplicamos dentro de los 15 días hábiles siguientes.',
      'Si solo quieres que retiremos tu usuario de la clasificación, dejar de recibir mensajes o borrar tu correo o WhatsApp, no necesitas mandar identificación: escríbenos a ' + CORREO + ' desde el correo que nos diste, o mándanos un mensaje directo a @cucoarts desde tu cuenta, y lo hacemos en un máximo de 5 días hábiles.',
    ],
  },
  {
    titulo: '7. Fotos y videos de eventos',
    parrafos: [
      `En nuestros eventos tomamos fotos y videos que podemos publicar en el sitio y en redes. Si apareces en alguno y prefieres que lo retiremos, escríbenos a ${CORREO}.`,
    ],
  },
  {
    titulo: '8. Agenda cultural (cucoarts.com/mty)',
    parrafos: [
      'La agenda reúne eventos de artes visuales de Monterrey que otras personas y organizaciones publican de forma abierta. De cada evento mostramos la información que ellos difunden, con el crédito y la liga a su cuenta o publicación original. Si eres organizador, artista o espacio y prefieres que corrijamos o retiremos un evento, escríbenos a ' + CORREO + '.',
      'Si participas con un check-in, una calificación, un comentario o una recomendación, lo revisamos antes de publicarlo; lo que no aprobamos no se publica. Se muestra tu alias (o "Visitante" si no pones uno), tu comentario, tu calificación y, si los das, tu red social y la liga a tu contenido. Tu correo o WhatsApp solo los usamos para contactarte sobre tu envío y no se muestran. Si das "me gusta" a un espacio o marcas "Yo voy" a un evento, no te pedimos correo ni nombre: guardamos solo un identificador anónimo que tu navegador genera (sin relación con tu identidad) para contar una sola vez por persona, y se muestra únicamente el total.',
      'No aceptamos archivos ni fotos: si quieres compartir contenido tuyo, pon la liga a tu publicación en tu red social, para que siempre tenga tu crédito. Las ligas llevan a sitios de terceros con sus propios avisos de privacidad. Te pedimos no incluir datos personales de otras personas ni datos sensibles.',
    ],
  },
  {
    titulo: '9. MTY VS ART (cucoarts.com/mty_vs_art)',
    parrafos: [
      'MTY VS ART es un juego abierto para descubrir y compartir arte local de Monterrey. Sumas puntos con tus publicaciones, tus historias y los eventos que compartes, y la ciudad sube de nivel cada mes. Para jugar no necesitas registrarte; si quieres reclamar tu usuario, lo haces en la página del juego.',
      'Reclamar tu usuario: nos das tu usuario de Instagram (obligatorio), la categoría con la que te identificas en la comunidad (obligatorio), un nombre público (opcional) y, si quieres, un correo o WhatsApp. Te damos un código que nos mandas por mensaje directo desde tu cuenta; con él confirmamos que la cuenta es tuya. Tu correo o WhatsApp nunca se publica: solo lo usamos, si lo autorizas, para invitaciones y recomendaciones.',
      `Qué es público: la clasificación muestra el usuario de Instagram, el nombre público, la categoría, el puntaje y el rango de las personas que se registraron y verificaron su cuenta; si prefieres, puedes aparecer con un alias. Si no te has registrado, no mostramos tu usuario ni un puntaje con tu nombre: tus publicaciones abiertas solo suman al total del evento. Si tu publicación aparece como contenido de la comunidad de un evento, mostramos la liga a tu publicación original. Para pedir que te retiremos, escríbenos a ${CORREO}.`,
      'Los puntos se calculan con información pública y con las acciones que haces en cucoarts.com. No te pedimos la contraseña de Instagram ni entramos a tu cuenta.',
      'Para reclamar tu usuario necesitas tener 18 años o más. Si eres menor de edad puedes jugar publicando y etiquetando, pero no te registramos ni guardamos tu correo o WhatsApp.',
      'El botón de proponer una colaboración abre tu programa de correo con el mensaje ya escrito: lo que escribas solo nos llega si lo envías.',
      'De dónde salen los datos de quien no se registra: de publicaciones abiertas de Instagram, Facebook y X que mencionan un evento o a CUCO ARTS. No entramos a cuentas privadas, no usamos programas automáticos para extraer datos de cuentas y solo anotamos los números visibles en pantalla. Si no quieres que contemos tus publicaciones, escríbenos y las dejamos fuera.',
      'Mensajes directos desde @cucoarts: si tu cuenta pública comparte arte visual de Monterrey (medio, organización o creador), podemos escribirte un solo mensaje para preguntarte si quieres recibir un boletín de eventos y recomendaciones. Lo hacemos de forma manual, no te enviamos más mensajes si no respondes o dices que no, y no incluimos datos de otras personas. Elegimos las cuentas por su contenido público, no por su puntaje.',
    ],
  },
  {
    titulo: '10. Cookies y medición',
    parrafos: [
      'Usamos Google Analytics para medir de forma estadística cómo se usa el sitio. Puedes borrar o bloquear las cookies desde la configuración de tu navegador.',
      'La página de MTY VS ART guarda en tu navegador el usuario que reclamaste y su código de verificación, para que no tengas que escribirlo otra vez. Puedes borrarlos desde la configuración de tu navegador.',
    ],
  },
  {
    titulo: '11. Personas fuera de México',
    parrafos: [
      `Si vives fuera de México, por ejemplo en la Unión Europea, puedes ejercer los mismos derechos escribiendo a ${CORREO}.`,
    ],
  },
  {
    titulo: '12. Cambios a este aviso',
    parrafos: [
      'Si este aviso cambia, publicaremos la versión nueva en cucoarts.com/privacidad con su fecha de actualización.',
      'Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad en materia de protección de datos personales en posesión de los particulares.',
    ],
  },
]

const FECHA_ALTA = '31 de marzo de 2023'
const FECHA_ACT = '9 de noviembre de 2026'

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
