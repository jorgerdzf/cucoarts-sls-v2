import { Button, Grid, Typography, Link } from '@mui/material'
import { Box } from '@mui/system'

//images
import i1 from "../assets/images/v2/s5-i1.jpg";

import React from 'react'
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const iconFontSize = 60;
const iconColor = '#111';

export default function Fifth() {
  return (
    <>
        <Box paddingTop={20} sx={{ backgroundColor: '#D9FF6F' }}>
            <Grid 
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                    <Grid item>
                        <Typography variant="h2">
                            <b>CUCO</b>
                        </Typography>
                        <Typography variant="h5" color="main">
                            El propósito de CUCO es lograr que el amor que hay en obra o
                            manifestación artística llegue al art lover correcto.
                        </Typography>
                        <br /><br />
                    </Grid>
                    <Grid item>
                        <img src={i1} alt="art hunting" style={{
                                borderRadius: '10%',
                                width: 600,
                                height: 400,
                                objectFit: 'cover'
                        }}></img>
                    </Grid>
                    <Grid item>
                        <br /><br />
                        <Typography variant="body1" color="inherit">
                        Somos art lovers pero trabajamos y convivimos con artistas de distintas disciplinas y trayectorias para vivir y entender su mundo también. 
                        </Typography>
                    </Grid>
                    <Grid item>
                    <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    paddingTop={4}>
                        <Grid item padding={2}>
                            <Link href="https://www.facebook.com/cucoarts" target="_blank">
                                <FacebookIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://twitter.com/cucoarts" target="_blank">
                                <TwitterIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor}/>
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://www.instagram.com/cucoarts/" target="_blank">
                                <InstagramIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://www.tiktok.com/@cucoarts.mx" target="_blank">
                                <MusicNoteIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://www.reddit.com/user/cucoarts" target="_blank">
                                <RedditIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://www.youtube.com/c/cucoarts" target="_blank">
                                <YouTubeIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                        <Grid item padding={2}>
                            <Link href="https://wa.me/+528120321492" target="_blank">
                                <WhatsAppIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
                            </Link>
                        </Grid>
                </Grid>
                    </Grid>
            </Grid>
            <Box paddingBottom={4}>
                
            </Box>
        </Box>
    </>
  )
}
