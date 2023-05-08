import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import social1 from '../assets/social1.png';
import social2 from '../assets/social2.png';

function SocialManagement() {
  return (
    <>
        <Grid
        container
        p={4}
        >
            <Grid item xs={2}></Grid>
            <Grid item xs={8} sx={{color:'#661DE2'}}>
                <Grid container>
                <Grid item xs={6} p={2}>
                        <Box sx={{borderRadius: '16px', backgroundColor: '#D9FF6F' }}>
                            <img src={social1} alt='social' width={300}></img>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Typography variant='h4'>
                                Creación de página <br></br>de red social.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Branding (colores, logo)
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Posts de bienvenida
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Creación de multiples páginas en paquete
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Desde $800 MXN
                            </Typography>
                            <br></br>
                            <br></br>
                        </Box>
                    </Grid>
                    <Grid item xs={6} p={2}>
                        <Box sx={{borderRadius: '16px', backgroundColor: '#D9FF6F' }}>
                            <img src={social2} alt='social' width={300}></img>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Typography variant='h4'>
                                Administración de <br></br>página de red social.
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Resolvemos dudas
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Creación de promociones pagadas
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Atención a clientes
                            </Typography>
                            <br></br>
                            <Typography variant='body1'>
                                Desde $800 MXN
                            </Typography>
                            <br></br>
                            <br></br>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    </>
  )
}

export default SocialManagement