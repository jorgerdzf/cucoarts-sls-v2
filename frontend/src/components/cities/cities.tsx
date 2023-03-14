import { Button, Grid, ImageList, ImageListItem, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import banner from './assets/frame36.png'
import React from 'react'
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import rectangle from './assets/rectangle.png';
import { PictureAsPdfOutlined } from '@mui/icons-material';

const artSize = 224;

const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
  ];

export default function cities() {
    return (
        <>
            <Box>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={12}>
                        <Paper sx={{ backgroundImage: `url(${banner})`, width: '100%', height: 280 }}>
                            <Typography variant='h2' color="white" pt={10}>
                                <b>Artistas @ Monterrey</b>
                            </Typography>
                            <br></br>
                            <Typography variant="body1" color="white">
                                Una galería de expresiones hechas por artistas activos en la ciudad
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid
                    pt={5}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                        <Grid item>
                            <Typography>
                                Si quieres ir más allá, estas son algunas opciones que tenemos para ti
                            </Typography>
                        </Grid>
                        <br></br>
                        <Grid item>
                            <Button sx={{padding: 2, marginRight: 2}} variant="contained" startIcon={<ImageSearchIcon/>}>Comprar arte local</Button>
                            <Button sx={{padding: 2, marginRight: 2}} variant="outlined">Pedir más info</Button>
                            <Button sx={{padding: 2, marginRight: 2}} variant="outlined">Sugerir contenido</Button>
                        </Grid>
                </Grid>
                <Grid
                    pt={5}
                    container
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={5} textAlign='left'>
                        <Typography variant='body2'>
                        Pronto incluíremos también <b>Eventos, Lugares, Organizaciones y Promotores</b> <br />
                        Estas obras son parte del catálogo de obras con entrega inmediata. Conoce más de ellas descargándolo.
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{backgroundColor: '#D9FF6F', padding:2}}>
                        <Button sx={{padding: 2}} variant="contained" startIcon={<PictureAsPdfOutlined/>}>
                            PDF | Obras en venta
                        </Button>
                        <br></br>
                        <Typography variant='body2' fontSize={12}>*Estas obras pueden ser entregadas inmediatamente</Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    mt={-1}
                    >
                    <Grid item xs={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                        <img src={rectangle} alt='rectangle' width={artSize} height={artSize}></img>
                    </Grid>
                    <Grid item xs={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                        <img src={rectangle} alt='rectangle' width={artSize} height={artSize}></img>
                    </Grid>
                    <Grid item xs={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                        <img src={rectangle} alt='rectangle' width={artSize} height={artSize}></img>
                    </Grid>
                    <Grid item xs={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                        <img src={rectangle} alt='rectangle' width={artSize} height={artSize}></img>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='column'
                    justifyContent="center"
                    alignItems="center"
                    mt={4}>
                    <Grid item>
                        <Box textAlign="left">
                            <Typography>
                                Estas obras han sido creadas por todo tipo de artistas locales y están ordenadas aleatoriamente
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <ImageList sx={{ width: 1000, height: 800, overflow:'scroll' }} cols={4} rowHeight={250}>
                        {itemData.map((item) => (
                            <ImageListItem key={item.img}>
                            <img
                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.title}
                                loading="lazy"
                            />
                            </ImageListItem>
                        ))}
                        </ImageList>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}
