import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import recordvoice from '../assets/images/recordvoice.png';
import videolibrary from '../assets/images/videolibrary.png';
import v13_81 from '../assets/images/v13_81.png';
import v13_82 from '../assets/images/v13_82.png';
import v13_98 from '../assets/images/v13_98.png';
import v13_99 from '../assets/images/v13_99.png';
import v13_100 from '../assets/images/v13_100.png';

import React from 'react'
const imgSize = 200;
const iconSize = 80;

export default function Fourth() {
  return (
    <>
        <Box 
            paddingTop={10} 
            sx={{ background: 'linear-gradient(0deg, rgba(217,255,111,1) 0%, rgba(217,255,111,1) 30%, rgba(255,255,255,1) 60%)' }}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                >
                <Grid item>
                    <Grid
                    container
                    justifyContent="center"
                    alignItems="center">
                        <Grid item xs={4} md={3}>
                            <img src={recordvoice} alt="" width={iconSize} height={iconSize} />
                        </Grid>
                        <Grid item xs={8} sx={{textAlign:'left'}} md={6}>
                            <Typography variant="h4">
                                Vox pópuli
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Simplemente, escríbenos para conocerte o platicar acerca de lo que tu desees: 
                                Puedes contarnos algo que tu estés haciendo o que necesites, te interese o estés buscando. 
                                Tu experiencia es la mejor fuente. La intención es poder ayudarte o ayudar a alguien más con tu información.
                            </Typography>
                            <br></br>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <img src={v13_98} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid
                    container
                    justifyContent="center"
                    alignItems="center">
                        <Grid item xs={4} md={3}>
                            <img src={v13_81} alt=""  width={iconSize} height={iconSize} />
                        </Grid>
                        <Grid item xs={8} sx={{textAlign:'left'}} md={6}>
                            <Typography variant="h4">
                                Art Hunting
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Una búsqueda entre todas las posibilidades que creadores locales o de cualquier parte del mundo 
                                pueden crear para ti. El objetivo tu lo defines: podría ser encontrar algo ya hecho o buscar quien 
                                cree algo especial para ti.

                                Es enfocado a ampliar las oportunidades para todo tipo de artistas que tengan la habilidad que buscas.
                            </Typography>
                            <br></br>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <img src={v13_99} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid
                    container
                    justifyContent="center"
                    alignItems="center">
                        <Grid item xs={4} md={3}>
                            <img src={v13_82} alt="" width={iconSize} height={iconSize}  />
                        </Grid>
                        <Grid item xs={8} sx={{textAlign:'left'}} md={6}>
                            <Typography variant="h4">
                                Murales
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Nos aliamos a tu equipo para realizar un proyecto exitoso de arte urbano con el fin que tu elijas  
                                (comercial o público). Esto implica ver y analizar los espacios, definir un objetivo, presupuestos
                                y tiempos.  
                            </Typography>
                            <br></br>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <img src={v13_100} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid
                    container
                    justifyContent="center"
                    alignItems="center">
                        <Grid item xs={4} md={3}>
                            <img src={videolibrary} alt="" width={iconSize} height={iconSize}  />
                        </Grid>
                        <Grid item xs={8} sx={{textAlign:'left'}} md={6}>
                            <Typography variant="h4">
                                Producción
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Creamos todo tipo de contenido con audio y video para redes sociales. Se incluyen la planeación, producción y edición de materiales. 
                                Tu experiencia es la mejor fuente. La intención es poder ayudarte a hacer realidad tus proyectos.
                            </Typography>
                            <br></br>
                        </Grid>    
                        <Grid item xs={12} md={3}>
                            <img src={v13_98} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}
