import { Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import arthunting from '../assets/images/arthunting.png';
import murales from '../assets/images/murales.png';
import produccion from '../assets/images/produccion.png';
import voxpopuli from '../assets/images/voxpopuli.png';

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
                    <Typography variant="h3" color="inherit">
                        Esto es lo que podemos crear juntos
                    </Typography>
                    <br></br>
                    <Typography variant="body1" color="inherit">
                        Estas son nuestras redes sociales y servicios creativos que tienen como propósito contribuir a las carreras de los artistas locales
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                pt={4}
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={3}>
                        <Grid id={'social'} item>
                            <Grid
                                container
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center">
                                    <Grid item>
                                        <Link href="https://www.facebook.com/cucoarts" target="_blank">
                                           <FacebookIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://twitter.com/cucoarts" target="_blank">
                                            <TwitterIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor}/>
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://www.instagram.com/cucoarts/" target="_blank">
                                           <InstagramIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://www.tiktok.com/@cucoarts.mx" target="_blank">
                                            <MusicNoteIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://www.reddit.com/user/cucoarts" target="_blank">
                                            <RedditIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://www.youtube.com/c/cucoarts" target="_blank">
                                            <YouTubeIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="https://wa.me/+528120321492" target="_blank">
                                            <WhatsAppIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                                        </Link>
                                    </Grid>
                            </Grid>
                        </Grid>
                        <Grid id={'mosaic'} item>
                            <Grid 
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                                <Grid item>
                                    <Grid 
                                        container
                                        justifyContent="center"
                                        alignItems="center"
                                        spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <img src={arthunting} alt="art hunting" ></img>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <img src={murales} alt="art hunting"></img>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <img src={produccion} alt="art hunting"></img>
                                        </Grid>
                                    </Grid>
                                </Grid>                                
                            </Grid>
                            <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            pt={3}>
                                <Grid item>
                                    <img src={voxpopuli} alt="art hunting"></img>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>);
}
