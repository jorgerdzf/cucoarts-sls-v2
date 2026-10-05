import React, { useEffect, useState } from 'react'
import './footer.css'

// Pie de página de todo cucoarts.com. Misma identidad que la landing: bloque oscuro plano, Neue Montreal para el mensaje
// y Courier para los datos. El idioma sigue a la llave "cucoarts-lang" (la misma de la landing y de /rob).

type Lang = 'es' | 'en'
const LANG_KEY = 'cucoarts-lang'
const MAIL = 'hello@cucoarts.com'

const COPY = {
  es: {
    tagline: 'Del norte con amor',
    about: 'Plataforma de descubrimiento artístico y cultural de Monterrey.',
    contact: 'Contacto',
    links: 'Enlaces',
    store: 'Tienda',
    privacy: 'Aviso de privacidad',
    home: 'Inicio',
    rights: 'Todos los derechos reservados.',
  },
  en: {
    tagline: 'From the north, with love',
    about: 'Art and culture discovery platform from Monterrey.',
    contact: 'Contact',
    links: 'Links',
    store: 'Store',
    privacy: 'Privacy notice',
    home: 'Home',
    rights: 'All rights reserved.',
  },
}

const readLang = (): Lang => {
  try {
    const s = localStorage.getItem(LANG_KEY)
    if (s === 'es' || s === 'en') return s
  } catch (e) { /* sin almacenamiento */ }
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es'
}

function Footer() {
  const [lang, setLang] = useState<Lang>(readLang)
  useEffect(() => {
    const sync = () => setLang(readLang())
    window.addEventListener('storage', sync)
    window.addEventListener('cucoarts-lang', sync)   // la landing lo emite al cambiar de idioma en la misma pestaña
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('cucoarts-lang', sync) }
  }, [])
  const c = COPY[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="cf" lang={lang}>
      <div className="cf-in">
        <div className="cf-grid">
          <div className="cf-brand">
            <a className="cf-logo" href="/"><span className="cf-sr">CUCO ARTS</span></a>
            <p className="cf-tag">{c.tagline}</p>
            <p className="cf-about">{c.about}</p>
          </div>
          <div className="cf-col">
            <h2 className="cf-h">{c.contact}</h2>
            <a href={`mailto:${MAIL}`}>{MAIL}</a>
            <span>Monterrey, N.L., México</span>
          </div>
          <div className="cf-col">
            <h2 className="cf-h">{c.links}</h2>
            <a href="/">{c.home}</a>
            <a href="https://store.cucoarts.com">{c.store}</a>
            <a href="/privacidad">{c.privacy}</a>
          </div>
        </div>
        <div className="cf-legal">
          <span>© {year} CUCO Cultural Collective México, S. de R.L. de C.V.</span>
          <span>{c.rights}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
