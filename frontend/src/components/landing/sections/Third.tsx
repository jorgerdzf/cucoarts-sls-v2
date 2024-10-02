import { Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

//images
import i4 from "../assets/images/v2/s3-i4.jpg";
import i6 from "../assets/images/v2/s3-i6.jpg";

var youtubeThumbnail = require('youtube-thumbnail');

const iconFontSize = 60;
const iconColor = '#111';
const imgSize = 300;

export default function Third() {
    var coberturaDigitalTnl = youtubeThumbnail('https://youtu.be/SBD6_wk05Kw?si=YBvEKgXw2y_8auPT').high.url;
    var producimosPodcastTnl = youtubeThumbnail('https://youtu.be/3gV9EmZ8meQ?si=5btRU6Ur9tLMVujJ').high.url;
    var documentalTnl = youtubeThumbnail('https://youtu.be/al33npKTa0Y?si=ZST3mT7uof4fJZSv').high.url;
    var contenidoRedesTnl = youtubeThumbnail('https://youtu.be/9GmvD7wHVOw?si=1rxMDaVVdRhmzbrC').high.url;
    
    console.log(coberturaDigitalTnl);
    return (
        <>
            <Box paddingTop={20} sx={{ background: 'linear-gradient(180deg, rgba(96,92,255,1) 0%, rgba(124,121,255,1) 10%, rgba(255,255,255,1) 30%)' }}>
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
                        <img src={coberturaDigitalTnl} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
                            Cobertura digital en tus eventos
                        </Typography>
                    </Grid>
                    <Grid item padding={2}>
                        <img src={producimosPodcastTnl} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
                            Producimos tu propio podcast
                        </Typography>
                    </Grid>
                    <Grid item padding={2}>
                        <img src={documentalTnl} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
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
                        <img src={i4} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
                            Vendemos tu obra
                        </Typography>
                    </Grid>
                    <Grid item>
                        <img src={contenidoRedesTnl} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
                            Creamos contenido para tus redes sociales
                        </Typography>
                    </Grid>
                    <Grid item>
                        <img src={i6} alt="art hunting" style={{
                            borderRadius: '20%',
                            width: imgSize,
                            height: imgSize,
                            objectFit: 'cover'
                        }}></img>
                        <Typography variant="body1" color="inherit" pt={2}>
                            Te conectamos con la comunidad artística local
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>);
}
