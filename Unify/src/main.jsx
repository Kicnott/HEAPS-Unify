import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  // strictmode component tells us of our errors
  <StrictMode>
    <App />
  </StrictMode>,
)
