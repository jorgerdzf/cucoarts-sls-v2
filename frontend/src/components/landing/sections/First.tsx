import { Box, Button, Grid, Typography } from "@mui/material";
import group1 from "../assets/images/Group1.png";

import React from "react";

function First() {
  return (
    <div>
        <Box paddingTop={10} sx={{ background: 'linear-gradient(0deg, rgba(96,92,255,1) 0%, rgba(124,121,255,1) 10%, rgba(255,255,255,1) 30%)'}}>
            <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                padding={2}
                >
                <Grid item>
                <Grid>
                    <Grid item textAlign='left'>
                    <Typography variant="h2">
                        <b>
                        Descubre un <br /> mundo creativo <br /> a tu alrededor
                        </b>
                    </Typography>
                    </Grid>
                    <Grid item textAlign='left'>
                    <Typography variant="body1">
                        Cultural Collective (CUCO) es un lugar para conocer y aprovechar
                        las <br/> habilidades creativas de la gente de nuestra ciudad
                    </Typography>
                    </Grid>
                    <Grid item textAlign='left'>
                        <br></br>
                        <Button variant="contained" href='/takeActions'>
                            <Typography sx={{textTransform: 'none'}}>Quiero descubrirlo</Typography>
                        </Button>
                        <br></br>
                        <br></br>
                        <Button variant="contained" sx={{backgroundColor:'#fff', color:'#605CFF'}}
                            href='/experiences'>
                            <Typography sx={{textTransform: 'none'}}>Soy Artista</Typography>
                        </Button>
                    </Grid>
                </Grid>
                </Grid>
                <Grid item>
                    <img src={group1} alt="bass" width={400} height={500}></img>
                </Grid>
            </Grid>
        </Box>
    </div>
  );
}

export default First;
