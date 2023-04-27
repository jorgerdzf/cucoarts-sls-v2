import { Box, Button, Grid, Link, Typography } from '@mui/material'
import React from 'react'
import produccion_placeholder1 from '../../../assets/images/produccion_placeholder1.png';
import produccion_placeholder2 from '../../../assets/images/produccion_placeholder2.png';
import produccion_1 from '../../../assets/images/produccion_1.png';
import produccion_2 from '../../../assets/images/produccion_2.png';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GetQuote from '../../shared/GetQuote';

const iconFontSize = 60;
const iconColor = '#111';


function Produccion() {
  const GetQuoteParams = {
    buttonTitle: 'Cotizar una producción',
    buttonHref: '/Connect',
    description1: 'Contenido hecho especialmente',
    description2: 'para cubrir tus necesidades'
  }
  return (
    <>
      <Grid container>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Box sx={{ backgroundColor: '#605CFF', borderRadius: '16px' }}>
            <br></br>
            <Typography variant="h5" sx={{ color: '#fff' }}>
              Producciones de alto impacto cultural y bajo presupuesto
            </Typography>
            <Typography variant='body1' sx={{ color: '#fff' }}>
              Llevamos más de 3 años creando todo tipo de contenidos e interacciones sociales para promover el talento local
            </Typography>
            <br></br>
            <Grid container p={2}>
              <Grid item>
                <img src={produccion_placeholder1} width={'90%'} alt='placeholder1'></img>
              </Grid>
              <Grid item>
                <img src={produccion_placeholder2} width={'90%'} alt='placeholder1'></img>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        pt={4}>
        <Grid item p={2}>
          <GetQuote params={GetQuoteParams}></GetQuote>
        </Grid>
        <Grid item p={2}>
          <Typography variant="h5" sx={{ color: '#99E21D' }}>
            Ayuda a la comunidad
          </Typography>
          <Typography variant='body2'>
            Cualquier duda que tengas, no dudes en escribirnos,
            <br></br> incluso preguntar información de alguna obra
            <br></br>u artista, lugar o evento artístico en la ciudad.
          </Typography>
          <br></br>
          <Button variant='outlined' href="/Faq">
            Preguntas frecuentes
          </Button>
        </Grid>
      </Grid>
      <Box pt={6} sx={{ background: 'linear-gradient(0deg, rgba(102,29,226,1.000) 0%, rgba(102,29,226,1.000) 30%, rgba(255,255,255,1) 60%)' }}>
        <Typography variant="h5">
          Comparte la valiosa historia que hay detrás de tus productos o servicios
        </Typography>
        <Grid
          p={4}
          container
          direction='row'
          justifyContent='center'
          alignItems='center'>
          <Grid item p={4}>
            <Grid
              container
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              sx={{ backgroundColor: '#D9FF6F' }} height={800}>
              <Grid item>
                <img src={produccion_1} width={'90%'} alt='produccion1'></img>
              </Grid>
              <Grid item>
                <Typography variant='h5' color='primary'>
                  creación o <br></br>
                  administración de <br></br>
                </Typography>
                <Typography variant='h4' color='primary'>
                  <b>páginas</b>
                </Typography>
              </Grid>
              <Grid item>
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
                      <TwitterIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor} />
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
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center">
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
            </Grid>
          </Grid>
          <Grid item p={4}>
            <Grid
              container
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              sx={{ backgroundColor: '#D9FF6F' }} height={800} width={300}>
              <Grid item>
                <img src={produccion_2} width={'90%'} alt='produccion1'></img>
              </Grid>
              <Grid item>
                <Typography variant='h5' color='primary'>
                  creación de <br></br>
                </Typography>
                <Typography variant='h4' color='primary'>
                  <b>contenido</b>
                </Typography>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-evenly"
                  alignItems="center">
                  <Grid item>
                    <Typography variant='h4'>
                      reels
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h4'>
                      posts
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h4'>
                      videos
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h4'>
                      fotografías
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box p={4} sx={{ backgroundColor: '#661DE2' }}>
       
          <Grid container>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Box sx={{ backgroundColor: '#48D218' }} p={4}>
                <Grid container direction='row' alignContent='center' justifyContent='center'>
                  <Grid item p={2}>
                    <Button variant='contained' href='/Connect'>Cotizar producción</Button>
                  </Grid>
                  <Grid item p={2}>
                    <Button variant='outlined' href='/Connect' sx={{backgroundColor: '#fff'}}>Ofrecer servicios</Button>
                  </Grid>
                </Grid>
                <Typography variant='body2'>
                  Contenido hecho especialmente para cubrir todo tipo de necesidades
                 </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
         
       
      </Box>
    </>
  )
}

export default Produccion