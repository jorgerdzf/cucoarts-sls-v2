import React from 'react'
import Fifth from './sections/Fifth'
import Fourth from './sections/Fourth'
import First from './sections/First'
import Second from './sections/Second'
import Third from './sections/Third'
import { Grid } from '@mui/material'

export default function Landing() {

  return (
    <>
      <Grid
        container
        direction='row'
        alignItems='center'
        justifyContent='center'>
          <Grid item xs={12}>
            <First></First>
          </Grid>
          <Grid item xs={12} id="ArtLover">
            <Second></Second>
          </Grid>
          <Grid item xs={12} id="Artist">
            <Third></Third>
          </Grid>
          <Grid item xs={12} id="Business">
            <Fourth></Fourth>
          </Grid>
          <Grid item xs={12}>
            <Fifth></Fifth>
          </Grid>
      </Grid>
    </>
  )
}
