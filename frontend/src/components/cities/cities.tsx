import { Button, Grid, ImageList, ImageListItem, Paper, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import banner from './assets/frame36.png';
import React, { useEffect } from 'react';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { PictureAsPdfOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getRandomArtForWeb, selectArtImages, selectArtImagesStatus } from '../../redux/art/artSlice';

const artSize = 224;

export default function Cities() {
    const smallScreen = useMediaQuery("(max-width: 768px)");
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
            
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={12} md={12}>
                        <Box sx={{ backgroundImage: `url(${banner})`, width: '100%', height: '100%' }}>
                            <Typography variant='h2' color="white" pt={6}>
                                <b>Artistas @ Monterrey</b>
                            </Typography>
                            <br></br>
                            <Typography variant="body1" color="white" pb={4}>
                                Una galería de expresiones hechas por artistas activos en la ciudad
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    pt={5}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                        <Grid item xs={12}>
                            <Typography>
                                Si quieres ir más allá, estas son algunas opciones que tenemos para ti
                            </Typography>
                        </Grid>
                        <br></br>
                        <Grid item xs={12}>
                            <Button sx={{padding: 2, margin: 1}} variant="contained" startIcon={<ImageSearchIcon/>}>Comprar arte local</Button>
                            <Button sx={{padding: 2, margin: 1}} variant="outlined">Pedir más info</Button>
                            <Button sx={{padding: 2, margin: 1}} variant="outlined" href='/Connect'>Sugerir contenido</Button>
                        </Grid>
                </Grid>
                <Grid
                    pt={5}
                    container
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={12} md={5} p={2}>
                        <Typography variant='body2'>
                        Pronto incluíremos también <b>Eventos, Lugares, Organizaciones y Promotores</b> <br />
                        Estas obras son parte del catálogo de obras con entrega inmediata. Conoce más de ellas descargándolo.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{backgroundColor: '#D9FF6F', padding:2}}>
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
                        <>
                        {imageList && imageList.length && (
                            <>
                                <Grid item xs={12} md={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                                    <img src={imageList.length ? imageList[imageList.length-1].url : ''} alt='rectangle' width={artSize} height={artSize}></img>
                                </Grid>
                                <Grid item xs={12} md={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                                    <img src={imageList.length ? imageList[imageList.length-2].url : ''} alt='rectangle' width={artSize} height={artSize}></img>
                                </Grid>
                                <Grid item xs={12} md={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                                    <img src={imageList.length ? imageList[imageList.length-3].url : ''} alt='rectangle' width={artSize} height={artSize}></img>
                                </Grid>
                                <Grid item xs={12} md={2} sx={{backgroundColor: '#D9FF6F', padding: 2}}>
                                    <img src={imageList.length ? imageList[imageList.length-4].url : ''} alt='rectangle' width={artSize} height={artSize}></img>
                                </Grid>
                            </>
                        )}
                        </>
                    
                </Grid>
                <br></br>
                <Grid
                    container
                    direction='column'
                    justifyContent="center"
                    alignItems="center"
                    mt={4}>
                    <Grid item xs={12} md={12}>
                        <Box textAlign="left" p={4}>
                            <Typography>
                                Estas obras han sido creadas por todo tipo de artistas locales y están ordenadas aleatoriamente
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <ImageList sx={{ width: smallScreen ? 300 : 1000, height: 800, overflow:'scroll' }} cols={smallScreen ? 1 : 4} rowHeight={250}>
                        {imageList.map((item) => (
                            <ImageListItem key={item.url.split('?').shift()}>
                            <img
                                src={`${item.url.split('?').shift()}`}
                                srcSet={`${item.url.split('?').shift()}`}
                                alt={item.title}
                                loading="lazy"
                            />
                            </ImageListItem>
                        ))}
                        </ImageList>
                    </Grid>
                </Grid>
            

        </>
    )
}
