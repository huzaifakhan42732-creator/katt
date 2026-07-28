import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'

// Note: StrictMode is intentionally omitted here. This app runs a single
// imperative, timer-driven animation sequence on mount (typewriters, GSAP
// timelines, intervals) that should only ever fire once — StrictMode's
// dev-only double-invoke of effects would double up timers and animations.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
