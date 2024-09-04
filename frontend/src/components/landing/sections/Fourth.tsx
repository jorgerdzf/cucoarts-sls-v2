import React from 'react'
import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { grey } from '@mui/material/colors';
import circle_example from "../assets/images/arthunting.png";

const primary = grey[900];
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
                        <img 
                            src={circle_example} 
                            alt="art hunting"
                            style={{
                                borderRadius: '50%'
                            }}
                        ></img>
                        <Typography variant="body2" color={primary}>
                            <br></br>
                            Buscamos arte para tu hogar
                        </Typography>
                    </Grid>
                    <Grid item padding={2}>
                        <img 
                            src={circle_example} 
                            alt="art hunting"
                            style={{
                                borderRadius: '50%'
                            }}
                        ></img>
                        <Typography variant="body2" color={primary}>
                            <br></br>
                            Te avisamos de eventos próximos
                        </Typography>
                    </Grid>
                    <Grid item padding={2}>
                        <img 
                            src={circle_example} 
                            alt="art hunting"
                            style={{
                                borderRadius: '50%'
                            }}
                        ></img>
                        <Typography variant="body2" color={primary}>
                            <br></br>
                            Conozcamos espacios de arte y cultura
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid 
                    container
                    direction="row"
                    justifyContent="space-evenly"
                >
                    <Grid item padding={2}>
                        <img 
                            src={circle_example} 
                            alt="art hunting"
                            style={{
                                borderRadius: '50%'
                            }}
                        ></img>
                        <Typography variant="body2" color={primary}>
                            <br></br>
                            Buscamos arte para tu hogar
                        </Typography>
                    </Grid>
                    <Grid item padding={2}>
                        <img 
                            src={circle_example} 
                            alt="art hunting"
                            style={{
                                borderRadius: '50%'
                            }}
                        ></img>
                        <Typography variant="body2" color={primary}>
                            <br></br>
                            Te avisamos de eventos próximos
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}
