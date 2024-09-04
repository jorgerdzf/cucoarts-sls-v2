import React from 'react'
import { Box, Grid, Typography, Link } from '@mui/material'
import circle_example from "../assets/images/arthunting.png";
import { grey } from '@mui/material/colors';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const primary = grey[900];
const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '20rem',
    height: '20rem',
};
const imgSize = 300;
const iconFontSize = 60;
const iconColor = '#111';

function Second() {
  return (
    <>
        <Box sx={{
            backgroundColor: '#605CFF',
        }} pt={10}
        >
            <Grid  
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center">
                <Grid item>
                    <Typography variant="h2" color={primary}>
                        <b>Art Lover</b>
                    </Typography>
                    <br></br>
                    <Typography variant="body2" color={primary}>
                        Aunque no te consideras artista, seguro que puedes ser muy creativ@
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid 
                        container
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Grid item padding={10}>
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
                        <Grid item padding={10}>
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
                        <Grid item padding={10}>
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
                    justifyContent="space-between"
                    alignItems="center">
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
        </Box>
    </>
  )
}

export default Second