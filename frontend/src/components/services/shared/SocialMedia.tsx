import { Grid, Link } from '@mui/material'
import React from 'react'
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const iconFontSize = 60;
const iconColor = '#111';

function SocialMedia() {
  return (
    <>
    <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
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
                          <TwitterIcon sx={{ fontSize: iconFontSize }} htmlColor={iconColor}/>
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
            <Grid item xs={2}></Grid>
          </Grid>
    </>
  )
}

export default SocialMedia