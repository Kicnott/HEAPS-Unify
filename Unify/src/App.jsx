import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import './classes/index.jsx'

// Components
import { Navbar } from "./components/navbar.jsx"
import { Button } from "./components/button.jsx"
import { RightDrawer } from "./components/rightDrawer.jsx"
import { MainCalendar } from './components/mainCalendar.jsx'
import { SimpleBlock } from './components/simpleBlock.jsx'

// Pages
import HomePage from "./pages/home.jsx"
import LoginPage from "./pages/login.jsx"

function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  )

}

export default App
