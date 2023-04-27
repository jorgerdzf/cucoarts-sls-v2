import { ImageSearch, CheckCircleOutline, Brush, LocalShipping } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

function GetQuote(this: any, props:any) {
    const { buttonTitle, buttonHref, description1, description2 } = props.params;
    return (
        <>
            <Box p={2} sx={{ backgroundColor: '#D9FF6F', borderRadius: '16px' }}>
                <Button variant="contained" href={buttonHref}>{buttonTitle}</Button>
                <br></br>
                <br></br>
                <Typography variant="body2">
                    {description1}
                </Typography>
                {description2 ? (
                    <>
                        <Typography variant="body2">
                            {description2}
                        </Typography>
                    </>
                ) : null}
                <br></br>
                <ImageSearch></ImageSearch>&nbsp;&nbsp;Búsqueda
                <br></br>
                <CheckCircleOutline></CheckCircleOutline>&nbsp;&nbsp;Selección
                <br></br>
                <Brush></Brush>&nbsp;Producción
                <br></br>
                <LocalShipping></LocalShipping>&nbsp;&nbsp;&nbsp;Entrega
            </Box>
        </>
    )
}

export default GetQuote