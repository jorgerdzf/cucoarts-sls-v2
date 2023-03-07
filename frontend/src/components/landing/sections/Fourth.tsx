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
export default function Fourth() {
  return (
    <>
        <Box>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                        <Grid item>
                            <img src={recordvoice} alt="" />
                        </Grid>
                        <Grid item sx={{textAlign:'left'}}>
                            <Typography variant="h4">
                                Vox pópuli
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Simplemente, escríbenos para conocerte o platicar acerca de lo que tu desees: <br/>
                                Puedes contarnos algo que tu estés haciendo o que necesites, te interese o estés buscando. <br/><br/>
                                Tu experiencia es la mejor fuente. La intención es poder ayudarte o ayudar a alguien más con tu información.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    pt={2}>
                        <Grid item>
                            <img src={v13_81} alt="" />
                        </Grid>
                        <Grid item sx={{textAlign:'left'}}>
                            <Typography variant="h4">
                                Art Hunting
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Una búsqueda entre todas las posibilidades que creadores locales o de cualquier parte del mundo <br/>
                                pueden crear para ti. El objetivo tu lo defines: podría ser encontrar algo ya hecho o buscar quien <br /> 
                                cree algo especial para ti.<br/><br/>

                                Es enfocado a ampliar las oportunidades para todo tipo de artistas que tengan la habilidad que buscas.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    >
                        <Grid item>
                            <img src={v13_82} alt="" />
                        </Grid>
                        <Grid item sx={{textAlign:'left'}}>
                            <Typography variant="h4">
                                Murales
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Nos aliamos a tu equipo para realizar un proyecto exitoso de arte urbano con el fin que tu elijas <br /> 
                                (comercial o público). Esto implica ver y analizar los espacios, definir un objetivo, presupuestos <br />
                                y tiempos.  

                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}>
                        <Grid item>
                            <img src={recordvoice} alt="" />
                        </Grid>
                        <Grid item sx={{textAlign:'left'}}>
                            <Typography variant="h4">
                                Vox pópuli
                            </Typography>
                            <br></br>
                            <Typography variant="body1">
                                Simplemente, escríbenos para conocerte o platicar acerca de lo que tu desees: <br/>
                                Puedes contarnos algo que tu estés haciendo o que necesites, te interese o estés buscando. <br/><br/>
                                Tu experiencia es la mejor fuente. La intención es poder ayudarte o ayudar a alguien más con tu información.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    pl={3}
                    >
                        <Grid item>
                            <img src={v13_98} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                        <Grid item>
                            <img src={v13_99} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                        <Grid item>
                            <img src={v13_100} alt="" width={imgSize} height={imgSize}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}
