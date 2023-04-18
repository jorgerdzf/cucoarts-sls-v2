import React from 'react';
import axios from 'axios';
import { Routes, Route, Router } from "react-router-dom";
import './App.css';
import {apiEndpoint, apiKey} from './constants/settings';
import { createTheme, ThemeProvider } from '@mui/material';

import Landing from './components/landing/Landing';
import Footer from './components/navigation/Footer';
import Header from './components/navigation/Header';
import Cities from './components/cities/Cities';
import TakeActions from './components/takeActions/TakeActions';
import Experiences from './components/experiences/Experiences';
import Contact from './components/contact/contact';
import PrivacyNotice from './components/privacyNotice/privacyNotice';

console.log('env vars', {apiEndpoint, apiKey});

axios.interceptors.request.use(
  function (config) {
    config.headers = config.headers ?? {};
      const token = apiKey
      if (token) {
        console.log('setting up api key', token);
        config.headers["X-Api-Key"] = `${token}`;
      }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: ['Poppins','sans-serif'].join(','),
    }
  },
  palette: {
    primary: {
      main: '#605CFF',
      light: '#605CFF',
      dark: '#461499'
    },
    secondary: {
      main: '#99E21D',
      light: '#D9FF6F',
      dark: '#48D218'
    },
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/Cities' element={<Cities />}/>
          <Route path='/takeActions' element={<TakeActions />}/>
          <Route path='/experiences' element={<Experiences />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/privateNotice' element={<PrivacyNotice />}/>
        </Routes>
        <Footer/>
      </div>
    </ThemeProvider>
  );
}

export default App;
