import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './import.jsx'

// Components
import { Navbar } from "./components/navbar.jsx"
import { Button } from "./components/button.jsx"
import { RightDrawer} from "./components/rightDrawer.jsx"
import { MainCalendar } from './components/mainCalendar.jsx'



function App() {

  const [isRightDrawerOpen, toggleRightDrawer] = useState(false)

  return (
    <div>
      <Navbar>
        <h1 style={{ margin: 0, marginRight: 'auto' }}>Unify</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button>Account</Button> //TODO
          <Button>Settings</Button> //TODO
          <Button onClick={() => toggleRightDrawer(!isRightDrawerOpen)}>Stuff</Button>
        </div>
      </Navbar>

      <RightDrawer rightDrawerOpen = {isRightDrawerOpen} onClose={() => toggleRightDrawer(!isRightDrawerOpen)}>
        <h2>MORE STUFF</h2> //TODO
      </RightDrawer>

      <MainCalendar />
    </div>

  )


}

export default App
