import { Box, Button, Grid, Link, Typography } from '@mui/material'
import React from 'react'
import murales_placeholder from '../../../assets/images/murales_placeholder.png';
import murales_1 from '../../../assets/images/murales_1.png';
import murales_2 from '../../../assets/images/murales_2.png';
import murales_3 from '../../../assets/images/murales_3.png';
import murales_4 from '../../../assets/images/murales_4.png';
import murales_5 from '../../../assets/images/murales_5.png';
import murales_6 from '../../../assets/images/murales_6.png';
import { ImageSearch, CheckCircleOutline, Brush, LocalShipping } from '@mui/icons-material';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const iconFontSize = 60;
const iconColor = '#111';

function Murales() {
  return (
    <>
      <Box sx={{backgroundColor: '#29272B'}}>
        <Box pt={4} sx={{color:'#fff'}}>
          <Typography variant='h5'>
            Los artistas han llevado el arte a las calles
          </Typography>
          <Typography>
            Entra en contacto con la cultura local
          </Typography>
          <br></br>
        </Box>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center">
            <Grid item>
              <Box>
                <img src={murales_placeholder} width={'90%'} alt="placeholder"></img>
              </Box>
            </Grid>
            <Grid item>
              <Box p={2} sx={{ backgroundColor: '#D9FF6F', borderRadius: '16px' }}>
                  <Button variant="contained" href="/Connect">Crear un mural</Button>
                  <br></br>
                  <br></br>
                  <Typography variant="body2">
                    Haz un proyecto de arte urbano <br></br> con ayuda de artistas profesionales.
                  </Typography>
                  <br></br>
                  <ImageSearch></ImageSearch>&nbsp;&nbsp;Búsqueda
                  <br></br>
                  <CheckCircleOutline></CheckCircleOutline>&nbsp;&nbsp;Selección 
                  <br></br>
                  <Brush></Brush>&nbsp;Producción
                  <br></br>
                  <LocalShipping></LocalShipping>&nbsp;&nbsp;&nbsp;Entrega
              </Box>
            </Grid>
        </Grid>
      </Box>
      <Box sx={{ background: 'linear-gradient(0deg, rgba(217,255,111,1) 0%, rgba(217,255,111,1) 30%, rgba(255,255,255,1) 60%)' }}>
        <Grid container pt={8}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant='h4'>
                  <b>Cada muro es un lienzo para expresar nuestra cultura local.</b>
                </Typography>
                <br></br>
                <Typography variant='body2'>
                  Sea artístico, público o comercial, cada pared tiene una historia.
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <img src={murales_1} width={'80%'} alt="murales"></img>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item>
            <Typography variant="body1">
              Descubre algunas de esas historias en nuestras redes sociales
            </Typography>
          </Grid>
          </Grid>
          <br></br>
          <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Grid
              container
              direction="row"
              justifyContent="space-evenly"
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
            <Grid item xs={2}></Grid>
          </Grid>
      </Box>
      <Box paddingTop={10} paddingBottom={10} sx={{ backgroundColor: '#D9FF6F' }}>
        <Typography variant='h5' color='primary'>
          Una conexión real con la cultula local
        </Typography>
        <Grid container pt={4}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={4}>
                <img src={murales_2} width={'80%'} alt="murales"></img>
                <Typography variant="body2">
                  Define tu propio proyecto de arte urbano.
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <img src={murales_3} width={'80%'} alt="murales"></img>
                <Typography variant="body2">
                  Tu controlas presupuesto, fechas y horarios de trabajo.
                </Typography>
              </Grid>
              <Grid item xs={4}>
              <img src={murales_4} width={'80%'} alt="murales"></img>
                <Typography variant="body2">
                  Selecciona el o los artistas que trabajarán en tu creación entre las opciones que tenemos para ti.
                </Typography>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={4}>
              <img src={murales_5} width={'80%'} alt="murales"></img>
                <Typography variant="body2">
                  Participa o disfruta tu creación mientras trabajan los artistas.
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <img src={murales_6} width={'70%'} alt="murales"></img>
                <Typography variant="body2">
                  Comparte tu nuevo mural con el mundo como contanido para tus redes sociales.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Murales