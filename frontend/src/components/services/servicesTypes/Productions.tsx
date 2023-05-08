import React from 'react'
import production1 from '../assets/production1.png';
import production2 from '../assets/production2.png';
import production3 from '../assets/production3.png';
import production4 from '../assets/production4.png';
import production5 from '../assets/production5.png';
import production6 from '../assets/production6.png';
import production7 from '../assets/production7.png';
import { Box, Typography } from '@mui/material';
import QuoteDetails from '../shared/QuoteDetails';
import SocialMedia from '../shared/SocialMedia';

const services = [
    {
        image: production1,
        title: 'Cápsulas culturales',
        description: 'Un video que muestra varios ángulos de una historia en particular. Podemos hacerlas a solicitud y preparación con un tema específico. Eventos, Estudio de artista, Presentaciones, Invitaciones',
        description2: '',
        cost: 'Desde $2,000 MXN'
    },
    {
        image: production2,
        title: 'Transmitelo con imágenes',
        description: 'Un concepto accesible para todo creador musical. Proyecto completo incluye: Planeación (Op) + Producción + Contenido para difusión (Op).',
        description2: 'Descuento para estudiantes y bandas amateurs',
        cost: 'Desde $5,000 MXN'
    },
    {
        image: production3,
        title: 'Para obtener una ganancia',
        description: 'Promovemos o hablamos de un producto o servicio, accesible para todo tipo de negocio, producto o servicio. Comentanos a que te dedicas y veremos como podemos ayudarte.',
        description2: 'Descuento para negocios culturales',
        cost: 'Desde $2,000 MXN'
    },
    {
        image: production4,
        title: 'De corta o larga duración',
        description: 'Contamos una historia a través de múltiples recursos. Podemos grabarlos en cualquier parte del mundo. Coordinamos y desarrollamos un proyecto completo (pre, producción y post).',
        description2: '',
        cost: 'Desde $5,000 MXN'
    },
    {
        image: production5,
        title: 'La historia detrás de la obra',
        description: 'Presentar de manera emocionante una colección de arte. Opción a Evento transmitido en vivo. Proyecto completo incluye: Branding (Colores, Typo) + Animaciones (Op) Fotografía o video (Op).',
        description2: '',
        cost: 'Desde $2,000 MXN'
    },
    {
        image: production6,
        title: 'Conecta con la audiencia',
        description: 'Transmisión simultánea hasta en 5 canales. Personalización total, Proyecto completo incluye: Transmisión en vivo HD + Producción de contenido Set up de cámaras, audio y escenografías (Op) + Speaker (Host) del programa en vivo (Op)',
        description2: '',
        cost: 'Desde $2,000 MXN'
    },
    {
        image: production7,
        title: 'Shows únicos',
        description: 'Uno o más hosts presentando contenido a la audiencia. Formato con video y audio profesionales, Proyecto completo incluye: Producción de contenido + Lugar de grabación (Op)  + Transmisión en vivo HD (Op) + Invitados (Op) + Creación y desarrollo de contenido (Op)',
        description2: '',
        cost: 'Desde $5,000 MXN'
    }
];


function Productions() {
    return (
        <>
            <Box p={4}>
                <Typography variant='h5'>
                    Comparte tus valiosas historias mostrando emocionantes escenas en video HD, con una buena imágen y buen audio para tu audiencia.
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

export default Productions