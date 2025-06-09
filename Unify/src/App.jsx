import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './import.jsx'

// Components
import { Navbar } from "./components/navbar.jsx"
import { Button } from "./components/button.jsx"



function App() {

  return (
    <div>
      <Navbar>
        <h1 style={{ margin: 0, marginRight: 'auto' }}>Unify</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button>Account</Button>
          <Button>Settings</Button>
          <Button>More</Button>
        </div>
      </Navbar>
    </div>

  )


}

export default App
