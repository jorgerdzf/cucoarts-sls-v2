import { Grid, Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

function Footer() {
  return (
    <>
      <Box height={50} pt={5}>
      <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
            <Grid item>
              <Typography>
              2022 CUCO Cultural Collective México S de RL de CV
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
              hello@cucoarts.com
              </Typography>    
            </Grid>
            <Grid item>
              <Typography>
                <Link href='' sx={{textDecoration:'none', color:'inherit'}}>
                  Aviso de Privacidad
                </Link>
              </Typography>
            </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Footer