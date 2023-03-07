import { Box, Grid, Typography } from '@mui/material'
import v9_11 from "../assets/images/v9_11.png";
import v9_13 from "../assets/images/v9_13.png";
import v10_24 from "../assets/images/v10_24.png";
import v10_28 from "../assets/images/v10_28.png";

import React from 'react'
const imgSize = 300;

function Second() {
  return (
    <>
        <Box sx={{backgroundColor: '#605CFF'}} pt={10}>
            <Grid  
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center">
                <Grid item>
                    <Box>
                        <img src={v9_13} alt="second" width={imgSize} height={imgSize}></img>
                    </Box>
                    <Typography variant="h4" color="secondary">
                     <b>Lo que sabes y haces es <br></br> tu GRAN VALOR</b>
                    </Typography>
                    <br/> 
                    <Typography variant="body1" sx={{color:'#fff'}}>
                        Tus gustos y pasiones son la base del desarrollo de la vida en la ciudad, <br/> 
                        pues donde inviertes tiempo o dinero, eso seguirá creciendo. <br/><br/> 
                        Cada actividad en tu día a día, <br/> 
                        AGREGA VALOR a la gente a tu alrededor.
                    </Typography>
                </Grid>
                <Grid item>
                    <Box>
                        <img src={v10_24} alt="second" width={imgSize} height={imgSize}></img>
                    </Box>
                    <Typography variant="h4" color="secondary">
                     <b>El futuro es COLECTIVO</b>
                    </Typography>
                    <br/> 
                    <Typography variant="body1" sx={{color:'#fff'}}>
                        La suma de todo lo que yo puedo ver es lo que le da forma (dentro de mí) <br/> 
                        a la ciudad que observo. En la medida en la que participo con la gente <br/> <br/> 
                        que me rodea y descubro su habilidad especial, la ciudad va tomando <br/> 
                        otros colores. Cada vez más brillosos y esperanzadores.
                    </Typography>
                </Grid>
            </Grid>
            <Grid  
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            pt={4}>
                <Grid item>
                    <Box>
                        <img src={v9_11} alt="second" width={imgSize} height={imgSize}></img>
                    </Box>
                    <Typography variant="h4" color="secondary">
                     <b>El talento necesita ATENCIÓN</b>
                    </Typography>
                    <br/> 
                    <Typography variant="body1" sx={{color:'#fff'}}>
                    Algo tan bien hecho, necesita que haya quien lo disfrute. <br/> <br/> 
                    
                    Hay todo tipo de creaciones y creadores en la ciudad que vale la pena conocer. <br/> 
                    Existen organizaciones o lugares interesantes en donde desarrollan algo creativo <br/> 
                    o simplemente inspiran a quien los visita o trabaja ahí.
                    </Typography>
                </Grid>
                <Grid item>
                    <Box>
                        <img src={v10_28} alt="second" width={imgSize} height={imgSize}></img>
                    </Box>
                    <Typography variant="h4" color="secondary">
                     <b>te vas a conocer mejor</b>
                    </Typography>
                    <br/> 
                    <Typography variant="body1" sx={{color:'#fff'}}>
                        ¿Qué es lo que verdaderamente estoy dispuesto a crear o hacer?  <br/>
                        ¿Si no soy yo por mí, quién?  <br/> <br/>
                        
                        Inspira a más gente a tu alrededor a valorarse a sí mismos. Reconocer y  <br/>
                        apreciar tu cultura es el primer paso, después el cielo es el límite. 
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}

export default Second