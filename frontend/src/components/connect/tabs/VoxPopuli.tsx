import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { emailjsPublicKey, emailjsServiceId, emailjsTemplateId } from '../../../constants/settings';
import conectandoVoxPopuli from "../../../assets/images/conectandoVoxPopuli.png";
import Snackbar from "@mui/material/Snackbar";
import { Close } from '@mui/icons-material';

function VoxPopuli() {
  const [response, setResponse] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setResponse(false);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const onSubmitFull = (data: any) => {
    console.log('errores', errors);
    if (errors.Nombre || errors.Email || errors.CiudadResidencia || errors.Descripcion) {
      setMessage(
        "Por favor revisa los campos en rojo para poder enviar tus respuestas"
      );
      setOpen(true);
    } else {
      var templateParams = {
        reply_to: data.Email,
        message: 
        `${data.Nombre} de: ${data.CiudadResidencia}
        con Correo: ${data.Email} quiere buscar o recomendar: -> ${data.Descripcion}
        ${data.TiempoResidencia ? 'tiene viviendo ahi: ' + data.TiempoResidencia : ''}
        `,
      };
      emailjs
        .send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams,
          emailjsPublicKey
        )
        .then(
          (result: any) => {
            if (result.status === 200) {
              setResponse(true);
              setMessage("¡Tus respuestas han sido enviadas exitosamente!");
              setOpen(true);
              setTimeout(() => {
                window.location.reload();
              }, 6000);
            }
            console.log(result);
          },
          (error: any) => {
            console.log(error);
            setMessage(
              "Ups! Ocurrio un error al enviar tus datos, por favor intentalo nuevamente"
            );
            setOpen(true);
          }
        );
    }
  };

  return (
    <> {!response ? (
      <Box>
        <Grid
          container
          pt={4}
        >
          <Grid item xs={12} md={2}></Grid>
          <Grid item xs={12} md={12}>
            <Box>
              <Typography variant='h5'>
                Explora el valor que podemos ofrecerte
              </Typography>
              <br></br>
              <Typography variant='body2'>
                Este es tu momento, presentate con nosotros 
              </Typography>
            </Box>
            <Box>
              <div>
                <form onSubmit={handleSubmit(onSubmitFull)}>
                  <Box sx={{ textAlign: "left", pt: 2 }}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="stretch">
                      <Grid item>
                        <TextField
                          error={errors.Nombre ? true : false}
                          id="Nombre"
                          label="Como te llamas?"
                          variant="outlined"
                          fullWidth
                          {...register("Nombre", { required: true, maxLength: 100 })}
                        />
                      </Grid>
                      <br></br>
                      <Grid item>
                        <TextField
                          error={errors.CiudadResidencia ? true : false}
                          id="CiudadResidencia"
                          label="Donde vives?"
                          variant="outlined"
                          fullWidth
                          {...register("CiudadResidencia", {
                            required: true,
                            maxLength: 100,
                          })}
                        />
                      </Grid>
                      <br></br>
                      <Grid item>
                        <TextField
                          error={errors.Email ? true : false}
                          id="Email"
                          label="Cual es tu correo eléctronico"
                          variant="outlined"
                          fullWidth
                          {...register("Email", {
                            required: true,
                            pattern: /^\S+@\S+$/i,
                          })}
                        />
                      </Grid>
                      <br></br>
                      {/* <Grid item>
                        <TextField
                          error={errors.TiempoResidencia ? true : false}
                          id="TiempoResidencia"
                          label="Tiempo viviendo ahí"
                          variant="outlined"
                          fullWidth
                          {...register("TiempoResidencia", {
                            required: false
                          })}
                        />
                      </Grid> */}
                    </Grid>
                    <br></br>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      sx={{ backgroundColor: '#D9FF6F' }}
                    >
                      <Box p={4} width={400}>
                        <Typography variant="h5">
                          Cuentanos, ¿Que tienes en mente?
                        </Typography>
                        <br></br>
                        <Grid item>
                          <TextField
                            sx={{ backgroundColor: '#fff' }}
                            error={errors.Descripcion ? true : false}
                            id="Descripcion"
                            label="Estoy buscando... / Quiero recomendar..."
                            variant="outlined"
                            multiline
                            rows={6}
                            fullWidth
                            {...register("Descripcion", {
                              required: true,
                              maxLength: 500,
                            })}
                          />
                        </Grid>
                        <br></br>
                      </Box>
                    </Grid>
                  </Box>
                  <Box sx={{ pt: 2 }}>
                    <Button size="large" variant="contained" type="submit">
                      Conectar
                    </Button>
                  </Box>
                </form>
              </div>
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Grid container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-end" >
              <Grid item>
                <img src={conectandoVoxPopuli} width={'70%'} alt="conectandoVoxPopuli"></img>
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={12} md={2}></Grid>
        </Grid>
      </Box>
    ) : (
      <Box>
        <Grid container pt={4}>
          <Grid item xs={12} md={2}></Grid>
          <Grid item xs={12} md={5} pt={8}>
            <Typography variant='h4'>
              ¡Muchas gracias por tus respuestas!
            </Typography>
            <br></br>
            <Typography variant='body1'>
              Si publicamos tu información o ayudamos a alguien con ella, te avisaremos en tus redes.
            </Typography>
            <br></br>
            <br></br>
            <Typography variant='body2'>
            Y si lleva a una venta, te toca un porcentaje.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
          <Grid container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-end" >
              <Grid item>
                <img src={conectandoVoxPopuli} width={'70%'} alt="conectandoVoxPopuli"></img>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}></Grid>
        </Grid>
      </Box>
    )}
    <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </>
  )
}

export default VoxPopuli