import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import arteCiudad_1 from '../../../assets/images/arteCiudad_1.png';
import arteCiudad_2 from '../../../assets/images/arteCiudad_2.png';
import arteCiudad_placeholder from '../../../assets/images/arteCiudad_placeholder.png';
import { Brush, CheckCircleOutline, ImageSearch, LocalShipping } from '@mui/icons-material';

function ArteCiudad() {
  return (
    <>
      <Box>
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
              <Grid item>
                <Typography variant="h5">
                  Explora y conoce creadores locales por ciudad
                </Typography>
                <Typography variant="body2">
                  Hemos reunido trabajos representativos de cada creador que encontramos y nos han recomendado para ti
                </Typography>
              </Grid>
              <br></br>
              <Grid item pt={2}>
                <Grid container>
                  <Grid item xs={5}>
                    <Box>
                      <img src={arteCiudad_1} width={100} alt="arteCiudad1"></img>
                    </Box>
                    <Typography variant="body2">
                      Las obras que verás fueron hechas por profesionales y también por estudiantes
                    </Typography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={5}>
                    <Box>
                      <img src={arteCiudad_2}width={300} alt="arteCiudad1"></img>
                    </Box>
                    <Typography variant="body2">
                      Si encuentras un artista que te gusta y lo contactas, recuerda decirle que lo encontraste aquí 
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <br></br>
              <Grid item>
                <img src={arteCiudad_placeholder} width={'100%'} alt="placeholder"></img>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
              <Grid item>
                <Box p={2} sx={{ backgroundColor: '#D9FF6F' }}>
                  <Button variant="contained" href="/Connect">Comprar arte local</Button>
                  <br></br>
                  <br></br>
                  <Typography variant="body2">
                    Sácale todo el provecho a tu <br></br> experiencia en cada etapa del proceso
                  </Typography>
                  <br></br>
                  <ImageSearch></ImageSearch>&nbsp;&nbsp;Búsqueda
                  <br></br>
                  <CheckCircleOutline></CheckCircleOutline>&nbsp;&nbsp;Selección 
                  <br></br>
                  <Brush></Brush>&nbsp;Producción
                  <br></br>
                  <LocalShipping></LocalShipping>&nbsp;&nbsp;&nbsp;Entrega
                </Box>
              </Grid>
              <br></br>
              <Grid item>
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
              <br></br>
              <Grid item pt={4}>
                <Typography variant="h5" sx={{color:'#99E21D'}}>
                  Sugerir contenido
                </Typography>
                
                <Typography variant='body2'>
                Ayúdanos a incluir a todos los creadores
                <br></br> locales en la sección de Vox Pópuli 
                </Typography>
              </Grid>
              <br></br>
              <Grid item>
              <Typography variant="h5" sx={{color:'#99E21D'}}>
                  hello@cucoarts.com
                </Typography>
                
                <Typography variant='body2'>
                o déjanos tus datos para contactarte.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ArteCiudad