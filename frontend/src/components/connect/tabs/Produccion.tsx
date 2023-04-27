import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import produccion_placeholder1 from '../../../assets/images/produccion_placeholder1.png';
import produccion_placeholder2 from '../../../assets/images/produccion_placeholder2.png';
import { ImageSearch, CheckCircleOutline, Brush, LocalShipping } from '@mui/icons-material';
import GetQuote from '../../shared/GetQuote';

function Produccion() {
  const GetQuoteParams = {
    buttonTitle: 'Cotizar una producción',
    buttonHref: '/Contact',
    description1: 'Contenido hecho especialmente',
    description2: 'para cubrir tus necesidades'
  }
  return (
    <>
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <Box sx={{backgroundColor: '#605CFF', borderRadius: '16px'}}>
          <br></br>
        <Typography variant="h5" sx={{color:'#fff'}}>
          Producciones de alto impacto cultural y bajo presupuesto
        </Typography>
        <Typography variant='body1' sx={{color:'#fff'}}>
          Llevamos más de 3 años creando todo tipo de contenidos e interacciones sociales para promover el talento local
        </Typography>
        <br></br>
        <Grid container p={2}>
          <Grid item>
            <img src={produccion_placeholder1} width={'90%'} alt='placeholder1'></img>
          </Grid>
          <Grid item>
            <img src={produccion_placeholder2} width={'90%'} alt='placeholder1'></img>
          </Grid>
        </Grid>
      </Box>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
    <Grid 
      container
      direction='row'
      justifyContent='center'
      alignItems='center'
      pt={4}>
      <Grid item p={2}>
       <GetQuote params={GetQuoteParams}></GetQuote>
      </Grid>
      <Grid item p={2}>
       <Typography variant="h5" sx={{color:'#99E21D'}}>
          Ayuda a la comunidad
        </Typography>
        <Typography variant='body2'>
        Cualquier duda que tengas, no dudes en escribirnos, 
        <br></br> incluso preguntar información de alguna obra 
        <br></br>u artista, lugar o evento artístico en la ciudad.
        </Typography>
        <br></br>
        <Button variant='outlined' href="/Faq">
          Preguntas frecuentes
        </Button>
      </Grid>
    </Grid>
    </>
  )
}

export default Produccion