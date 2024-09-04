import { Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import arthunting from '../assets/images/arthunting.png';
import murales from '../assets/images/murales.png';
import produccion from '../assets/images/produccion.png';

import React from "react";

const iconFontSize = 60;
const iconColor = '#111';

export default function Third() {
    return (
    <>
        <Box paddingTop={20} sx={{ background: 'linear-gradient(180deg, rgba(96,92,255,1) 0%, rgba(124,121,255,1) 10%, rgba(255,255,255,1) 30%)'}}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Typography variant="h2" color="inherit">
                        <b>Artista</b>
                    </Typography>
                    <br></br>
                    <Typography variant="body2" color="inherit">
                        Tienes mucho que compartir, no pierdas tiempo buscando cómo
                    </Typography>
                </Grid>
            </Grid>
            <Grid
            pt={2}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center">
                <Grid item padding={2}>
                    <img src={arthunting} alt="art hunting"></img>
                    <Typography variant="body1" color="inherit">
                    Cobertura digital en tus eventos
                    </Typography>
                </Grid>
                <Grid item padding={2}>
                    <img src={murales} alt="art hunting"></img>
                    <Typography variant="body1" color="inherit">
                    Producimos tu propio podcast
                    </Typography>
                </Grid>
                <Grid item padding={2}>
                    <img src={produccion} alt="art hunting"></img>
                    <Typography variant="body1" color="inherit">
                    Creamos un documental con tu historia
                    </Typography>
                </Grid>
            </Grid>
            <Grid
            pt={2}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center">
                <Grid item padding={2}>
                    <img src={arthunting} alt="art hunting" ></img>
                    <Typography variant="body1" color="inherit">
                    Vendemos tu obra
                    </Typography>
                </Grid>
                <Grid item>
                    <img src={murales} alt="art hunting"></img>
                    <Typography variant="body1" color="inherit">
                    Creamos contenido para tus redes sociales
                    </Typography>
                </Grid>
                <Grid item>
                    <img src={produccion} alt="art hunting"></img>
                    <Typography variant="body1" color="inherit">
                    Te conectamos con la comunidad artística local
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    </>);
}
