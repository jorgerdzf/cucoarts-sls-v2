import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import Productions from './servicesTypes/Productions'
import Events from './servicesTypes/Events'
import SocialManagement from './servicesTypes/SocialManagement'
import SocialMedia from './shared/SocialMedia'
import Photography from './servicesTypes/Photography'

interface servicesProps {
    activeService: string
}

function Services(props: servicesProps) {
    const {activeService} = props;
    const [expanded, setExpanded] = useState<string | boolean>(activeService);
    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Box sx={{
                pt: 8
            }}>
                <Typography variant='h4'>
                    <b>Conectando con la ciudad</b>
                </Typography>
                <Typography variant='caption'>
                    Participa de verdad con la gente que es tan creativa como tú y vive cerca de ti
                </Typography>
            </Box>
            <Box p={4}>
                <Grid
                    container
                    direction='row'
                    justifyContent='center'
                    alignContent='center'>
                    <Grid item sx={{ backgroundColor: '#48D218', borderRadius: '16px' }} p={2}>
                        <Grid
                            container
                            direction='row'
                            justifyContent='center'
                            alignContent='center'>
                            <Grid item p={2}>
                                <Button variant='outlined' href='/Experiences' sx={{ backgroundColor: '#fff' }}>Experiencias de creativos</Button>
                            </Grid>
                            <Grid item p={2}>
                                <Button variant='outlined' href='https://www.youtube.com/cucoarts' sx={{ backgroundColor: '#fff' }}>Canal de Youtube</Button>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Typography variant='body2'>
                            Cada trabajo es hecho con mucho detalle y cuidado de compartir una historia especial
                        </Typography>
                    </Grid>
                    <Grid item pl={2}>
                        <Box p={4} sx={{ backgroundColor: '#D9FF6F',borderRadius: '16px'  }}>
                            <Button variant="contained" href="/Connect">Cotizar una producción</Button>
                            <br></br>
                            <br></br>
                            <Typography variant="body2">
                                Contenido hecho especialmente para cubrir tus necesidades
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box pt={6} sx={{ background: 'linear-gradient(0deg, rgba(102,29,226,1.000) 0%, rgba(102,29,226,1.000) 30%, rgba(255,255,255,1) 60%)' }}>
                <Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8} pb={12}>
                        <Accordion 
                            sx={{backgroundColor: 'transparent'}} 
                            expanded={expanded === 'productions'}
                            onChange={handleChange('productions')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant='h4'>
                                    Cotiza todo tipo de producciones
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Productions></Productions>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion 
                            sx={{backgroundColor: 'transparent'}} 
                            expanded={expanded === 'events'}
                            onChange={handleChange('events')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography variant='h4'>
                                    Cotiza todo tipo de eventos
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Events></Events>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion 
                            sx={{backgroundColor: 'transparent'}} 
                            expanded={expanded === 'social'}
                            onChange={handleChange('social')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography variant='h4'>
                                    Cotiza manejo de redes sociales
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SocialManagement></SocialManagement>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion 
                            sx={{backgroundColor: 'transparent'}} 
                            expanded={expanded === 'photo'}
                            onChange={handleChange('photo')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography variant='h4'>
                                    Cotiza producción fotográfica
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Photography></Photography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
                <Box p={4}>
                    <Typography variant='body1'>
                        Encuentra las historias en que hemos participado en su creación en nuestras redes sociales
                    </Typography>
                    <br></br>
                    <SocialMedia></SocialMedia>
                    <br></br>
                    <br></br>
                </Box>
            </Box>
        </>
    )
}

export default Services