import React from 'react'
import events1 from '../assets/events1.png';
import events2 from '../assets/events2.png';
import events3 from '../assets/events3.png';
import events4 from '../assets/events4.png';
import events5 from '../assets/events5.png';
import { Box, Typography } from '@mui/material';
import QuoteDetails from '../shared/QuoteDetails';
import SocialMedia from '../shared/SocialMedia';


const services = [
  {
    image: events1,
    title: 'Experiencia para toda la familia',
    description: 'Creación de un programa de actividades culturales para todas las edades. Conducción + Música + Arte urbano + Talleres + Comida. Proyecto completo incluye: Planeación + Producción + Contenido para difusión.',
    description2: '',
    cost: 'Desde $10,000 MXN'
  },
  {
    image: events2,
    title: 'Crear con las manos',
    description: 'Talleres de artes y creatividad para todas las edades. Para grupo o individual. Proyecto completo incluye: Artista(s) instructor + Artistas ayudantes + Instalaciones (Op) Música en vivo (Op) + Materiales (Op) + Contenido para difusión (Op).',
    description2: '',
    cost: 'Desde $1,000 MXN'
  },
  {
    image: events3,
    title: 'Arte urbano para todos',
    description: 'El artista dibuja un trazo original o definido. Con ayuda del artista, el público puede participar en el coloreado con spray la imágen del mural. Proyecto completo incluye: Música en vivo (Op) + Materiales (Op) + Contenido para difusión (Op).',
    description2: '',
    cost: 'Desde $5,000 MXN'
  },
  {
    image: events4,
    title: 'Música para tu audiencia',
    description: 'Producción de un concierto de 1 o más artistas o agrupaciones. Ofrece un concierto de alta calidad para tu audiencia, con artistas locales, nacionales o internacionales. Proyecto completo incluye: Planeación + Producción + Contenido para difusión.',
    description2: '',
    cost: 'Desde $10,000 MXN'
  },
  {
    image: events5,
    title: 'Imágenes que cuentan una historia',
    description: 'Dirección, producción y material de difusión de una colección de imágenes creadas por uno o más artistas. Asesoría en la gestión y búsqueda de recursos para producción. Proyecto completo incluye: Planeación + Producción + Curadoría (Op) + Artista(s) (Op) + Instalaciones (Op) + Música en vivo (Op) + Indumentaria (Op) + Contenido para difusión (Op).',
    description2: '',
    cost: 'Desde $5,000 MXN'
  }
]

function Events() {
  return (
    <>
      <Box p={4}>
        <Typography variant='h5'>
          Comparte tus valiosas historias con una buena imágen y buen audio para tu audiencia
        </Typography>
        <QuoteDetails services={services}></QuoteDetails>
      </Box>
      <Box p={1}>
        <Typography variant='body1'>
          Encuentra las historias en que hemos participado en su creación en nuestras redes sociales
        </Typography>
        <SocialMedia></SocialMedia>
      </Box>
    </>
  )
}

export default Events