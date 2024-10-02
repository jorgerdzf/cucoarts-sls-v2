import React from 'react'
import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { grey } from '@mui/material/colors';

//images
import i1 from "../assets/images/v2/s4-i1.jpg";
import i2 from "../assets/images/v2/s4-i2.jpg";
import i3 from "../assets/images/v2/s4-i3.jpg";

const primary = grey[900];
const imgSize = 300;
const iconSize = 80;

export default function Fourth() {
    return (
        <>
            <Box
                paddingTop={10}
                sx={{ background: 'linear-gradient(0deg, rgba(217,255,111,1) 0%, rgba(217,255,111,1) 30%, rgba(255,255,255,1) 60%)' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                        <Typography variant="h2" color="inherit">
                            <b>Culturiza tu negocio</b>
                        </Typography>
                        <br></br>
                        <Typography variant="body2" color="inherit">
                            Aprovecha el gran talento de los artistas profesionales de tu ciudad para impulsar el impacto de tu negocio
                        </Typography>
                    </Grid>
                </Grid>
                <br></br>
                <br></br>
                <Grid item>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-evenly"
                    >
                        <Grid item padding={2}>
                            <img src={i1} alt="art hunting" style={{
                                borderRadius: '50%',
                                width: imgSize,
                                height: imgSize,
                                objectFit: 'cover'
                            }}></img>
                            <Typography variant="body2" color={primary}>
                                <br></br>
                                Creamos <b>arte</b> original y personalizado
                            </Typography>
                        </Grid>
                        <Grid item padding={2}>
                            <img src={i2} alt="art hunting" style={{
                                borderRadius: '50%',
                                width: imgSize,
                                height: imgSize,
                                objectFit: 'cover'
                            }}></img>
                            <Typography variant="body2" color={primary}>
                                <br></br>
                                Te organizamos un <b>evento</b> en tu negocio
                            </Typography>
                        </Grid>
                        <Grid item padding={2}>
                            <img src={i3} alt="art hunting" style={{
                                borderRadius: '50%',
                                width: imgSize,
                                height: imgSize,
                                objectFit: 'cover'
                            }}></img>
                            <Typography variant="body2" color={primary}>
                                <br></br>
                                Producimos <b>contenido digital</b> original para ti
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
