import { Box, Button, Grid, Typography } from "@mui/material";
import group1 from "../assets/images/Group1.png";
import img_encabezado from "../assets/images/Encabezado.png";

import React from "react";

function First() {
  return (
    <>
        <Box paddingTop={4}
        sx={{
            background: 'linear-gradient(0deg, rgba(96,92,255,1) 0%, rgba(124,121,255,1) 10%, rgba(255,255,255,1) 30%)',
        }}>
            <Grid 
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            sx={{ 
                //
                backgroundImage: `url(${img_encabezado})`,
                backgroundSize: 'cover', // Adjust the image size
                backgroundPosition: 'center', // Center the image
                backgroundRepeat: 'no-repeat', // Avoid repeating the image
                height: '90vh', // Set the height to cover the entire viewport height
                width: '100%', // Set the width to cover the entire width of the box
                }}
            >
                <Grid item></Grid>
                <Grid item textAlign='center'>
                    <Typography variant="h2" color="white">
                        Si le falta un proposito <br /> <b>NO ES ARTE</b>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" color="white">
                        El arte debe ser para todos, pero todos somos diferentes 
                        <br/> ¿Qué te identifica mejor?
                    </Typography>
                    <br></br>
                    <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    >
                        <Grid item>
                            <Button variant="text" href='#ArtLover'>
                                <Typography 
                                sx={{
                                    textTransform: 'none',
                                    color: 'white'
                                }}>Art Lover</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="text" href='#Artist'>
                                <Typography 
                                sx={{
                                    textTransform: 'none',
                                    color: 'white'
                                }}>Artista</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="text" href='#Business'>
                                <Typography 
                                sx={{
                                    textTransform: 'none',
                                    color: 'white'
                                }}>Negocio</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>    
            </Grid>
        </Box>
    </>
  );
}

export default First;
