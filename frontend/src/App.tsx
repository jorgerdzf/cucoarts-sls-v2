import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';

import Landing from './components/landing/Landing';
import Husky from './components/landing/Husky';
import Murales from './components/landing/Murales';
import ArtePorEncargo from './components/landing/ArtePorEncargo';
import NotFound from './components/landing/NotFound';
import Footer from './components/navigation/Footer';
import PrivacyNotice from './components/privacyNotice/PrivacyNotice';

/* Rutas de cucoarts.com. El español vive en la raíz y el inglés bajo /en.
   Las rutas que no existen muestran la página 404 (CloudFront la entrega con estado 404).
   Las páginas antiguas (/Cities, /Services, /Experiences, /Connect, /Contact, /Faq) se retiraron en octubre de 2026:
   CloudFront las redirige a la portada (ver infra/cloudfront/viewer-request.js). */
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing />}/>
        <Route path='/en' element={<Landing />}/>
        <Route path='/husky' element={<Husky />}/>
        <Route path='/en/husky' element={<Husky />}/>
        <Route path='/murales' element={<Murales />}/>
        <Route path='/en/murals' element={<Murales />}/>
        <Route path='/arte-por-encargo' element={<ArtePorEncargo />}/>
        <Route path='/en/custom-art' element={<ArtePorEncargo />}/>
        <Route path='/privacidad' element={<PrivacyNotice />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
