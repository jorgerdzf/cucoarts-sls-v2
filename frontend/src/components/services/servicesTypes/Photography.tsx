import { Grid, Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import photo1 from '../assets/photo1.png';
import photo2 from '../assets/photo2.png';
import photo3 from '../assets/photo3.png';

function Photography() {
    const smallScreen = useMediaQuery("(max-width: 768px)");
  return (
    <>
     <Grid
        container
        justifyContent='center'
        p={4}
        >
            <Grid item xs={12} md={12} sx={{color:'#661DE2'}}>
                <Grid container
                        direction={smallScreen ? 'column' : 'row'}
                        justifyContent='center'
                        alignContent='center'>
                    <Grid item xs={12} md={4} p={2}>
                        <Box sx={{borderRadius: '16px', backgroundColor: '#D9FF6F' }}>
                            <img src={photo1} alt='social' width={200}></img>
                            
                            <Typography variant='h4'>
                                Video
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Reels de 60 segundos
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Posts de bienvenida
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Creamos el material o usamos el tuyo, se entrega una edición lista para subir.
                            </Typography>
                            <br></br>
                            <Typography variant='body1' color='#111'>
                               <b>Desde $1,000 MXN</b>
                            </Typography>
                            <br></br>
                            <br></br>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} p={2}>
                        <Box sx={{borderRadius: '16px', backgroundColor: '#D9FF6F' }}>
                            <img src={photo2} alt='social' width={200}></img>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Typography variant='h4'>
                                Posts.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Creamos originales o usamos tu branding
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Dimensiones adecuadas según necesidad
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Imágenes PNG o JPG para subir, mejor precio x cantidad.
                            </Typography>
                            <br></br>
                            <Typography variant='body1' color='#111'>
                               <b>Desde $500 MXN</b>
                            </Typography>
                            <br></br>
                            <br></br>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} p={2}>
                        <Box sx={{borderRadius: '16px', backgroundColor: '#D9FF6F' }}>
                            <img src={photo3} alt='social' width={200}></img>

                            <Typography variant='h4'>
                                Fotos.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Sesiones de fotos semi profesionales.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Cámara Sony A7c con iluminación.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                            Se entregan todas las fotos tomadas
                            </Typography>
                            <br></br>
                            
                            <Typography variant='body1' color='#111'>
                               <b>Desde $1,500 MXN</b>
                            </Typography>
                            <br></br>
                            <br></br>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        
    </>
  )
}

export default Photography