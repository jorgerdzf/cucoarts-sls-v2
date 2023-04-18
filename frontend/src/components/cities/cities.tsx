import { Button, Grid, ImageList, ImageListItem, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import banner from './assets/frame36.png';
import React, { useState, useEffect } from 'react';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import rectangle from './assets/rectangle.png';
import { PictureAsPdfOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getRandomArtForWeb, selectArtImages, selectArtImagesStatus } from '../../redux/art/artSlice';

const artSize = 224;

export default function Cities() {
    const dispatch = useAppDispatch();
    const loadingImagesStatus = useAppSelector(selectArtImagesStatus);
    const imageList:any[] = useAppSelector(selectArtImages);

    useEffect(() => {
        console.log('enter use effect');
        if(loadingImagesStatus
     === 'idle' && !imageList.length) {
            dispatch(getRandomArtForWeb());
        }
    }, [dispatch, imageList, loadingImagesStatus]);

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
                        {imageList.map((item) => (
                            <ImageListItem key={item.name}>
                            <img
                                src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
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