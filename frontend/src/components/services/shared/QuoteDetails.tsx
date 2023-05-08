import { Box, Grid, Typography } from '@mui/material';
import React from 'react'

interface QuoteDetailsProps {
    services: {
        image: string,
        title: string,
        description: string,
        description2: string,
        cost: string
    }[];
}
function QuoteDetails(props: QuoteDetailsProps) {
    const { services } = props;
    return (
        <>
            <Box sx={{backgroundColor: 'transparent'}}>
                <Grid
                container
                direction='row'
                justifyContent='center'
                alignContent='center'
                sx={{backgroundColor: 'transparent'}}>
                    {services && services.length > 0 ? (
                        <>
                            {services.map((s) => {
                                return <>
                                    <Grid item>
                                        <Grid
                                        container
                                        p={2}
                                        >
                                            <Grid item xs={12} md={3}>
                                                <img src={s.image} alt={s.image} width={200}></img>
                                            </Grid>
                                            <Grid item xs={12} md={6} textAlign='left'>
                                                <Typography variant='h5'>
                                                    {s.title}
                                                </Typography>
                                                <br></br>
                                                <Typography variant='body1'>
                                                    {s.description}
                                                </Typography>
                                                {s.description2 ? (
                                                    <>
                                                        <br></br>
                                                        <Typography variant='caption' color='Green'>
                                                            {s.description2}
                                                        </Typography>
                                                    </>
                                                ) : (null)}
                                            </Grid>
                                            <Grid item xs={12} md={3} pt={6}>
                                                <Typography variant='body1'>
                                                    {s.cost}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            })}
                        </>
                    ) : (<></>)}
                </Grid>
            </Box>
        </>
  )
}

export default QuoteDetails