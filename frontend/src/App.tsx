import React from 'react';
import axios from 'axios';
import { Routes, Route } from "react-router-dom";
import './App.css';
import { apiKey} from './constants/settings';
import { createTheme, ThemeProvider } from '@mui/material';

import Landing from './components/landing/Landing';
import Footer from './components/navigation/Footer';
import Header from './components/navigation/Header';
import Cities from './components/cities/Cities';
import Experiences from './components/experiences/Experiences';
import Connect from './components/connect/Connect';
import Services from './components/services/Services';
import Faq from './components/Faq/Faq';
import PrivacyNotice from './components/privacyNotice/PrivacyNotice';

axios.interceptors.request.use(
  function (config) {
    config.headers = config.headers ?? {};
      const token = apiKey
      if (token) {
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
  const defaultService = 'productions';

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/Cities' element={<Cities />}/>
          <Route path='/Connect' element={<Connect />}/>
          <Route path='/Experiences' element={<Experiences />}/>
          <Route path='/Services' element={<Services activeService={defaultService}/>}/>
          <Route path='/Contact' element={<Connect />}/>
          <Route path='/PrivacyNotice' element={<PrivacyNotice />}/>
          <Route path='/Faq' element={<Faq />}/>
        </Routes>
        <Footer/>
      </div>
    </ThemeProvider>
  );
}

export default App;
