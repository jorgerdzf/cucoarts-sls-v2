import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import group5 from '../assets/images/Group5.png';
import React from 'react'

export default function Fifth() {
  return (
    <>
        <Box paddingTop={20} sx={{ backgroundColor: '#D9FF6F' }}>
            <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                    <Grid item>
                        <Typography variant="h2">
                            <b>
                            Comienza a <br />
                            disfrutar el talento <br />
                            de tu ciudad <br />
                            </b>
                        </Typography>
                        <Typography variant="body1">
                            ¿Hay algo que quieres comenzar a crear o descubrir hoy en Monterrey?
                        </Typography>
                        <br /><br />
                        <Button variant="contained" sx={{width:220}} href="/Cities">
                            <Typography>
                                    Si!     
                            </Typography>
                        </Button>
                        <br /><br />
                        <Button variant="outlined" href="/Connect">
                            <Typography>
                                Estoy en otra ciudad
                            </Typography>
                        </Button>
                    </Grid>
            </Grid>
            <Box>
                <img src={group5} alt="group5" width={'80%'}></img>
            </Box>
        </Box>
    </>
  )
}
