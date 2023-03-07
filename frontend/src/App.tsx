import React from 'react';
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material';

import Landing from './components/landing/Landing';
import Footer from './components/navigation/Footer';
import Header from './components/navigation/Header';

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
        <Header></Header>
        <Landing></Landing>
        <Footer></Footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
