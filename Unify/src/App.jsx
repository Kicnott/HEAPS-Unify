import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calendar from './components/calendar.jsx'

function App() {
  const meetings = {
    '2024-04-05': ["wasting time", "lol", "donating to mr beast"],
    '2025-06-13': ["drinking", "rah", "fighting mr beast"],
  }
  return (
      <Calendar meetings={meetings}/>
  );
}

export default App
