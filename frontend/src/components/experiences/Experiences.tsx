import { Box, Grid, ImageList, ImageListItem, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getRandomArtForWeb, selectArtImages, selectArtImagesStatus } from '../../redux/art/artSlice';

function Experiences() {

  const dispatch = useAppDispatch();
  const loadingImagesStatus = useAppSelector(selectArtImagesStatus);
  const imageList: any[] = useAppSelector(selectArtImages);

  useEffect(() => {
    console.log('enter use effect');
    if (loadingImagesStatus
      === 'idle' && !imageList.length) {
      dispatch(getRandomArtForWeb());
    }
  }, [dispatch, imageList, loadingImagesStatus]);

  return (
    <>
      <Box sx={{
        pt: 8
      }}>
        <Typography variant='h4'>
          <b>Experiencias</b>
        </Typography>
        <Typography variant='caption'>
          La gente en la comunidad es muy diferente pero todos son muy creativos
        </Typography>
      </Box>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignContent='center'>
        <Grid item>
          <Box p={4} textAlign='center'>
            <Typography variant='body1'>
              Hemos reunido las experiencias que vivieron personas en la comunidad, a través de nuestros servicios
            </Typography>
            <Typography variant='body1'>
              Si tienes alguna obra o momento que quieras compartir, etítquetanos #cucoarts
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <ImageList sx={{ width: 1000, height: 800, overflow: 'scroll' }} cols={4} rowHeight={200}>
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

export default Experiences