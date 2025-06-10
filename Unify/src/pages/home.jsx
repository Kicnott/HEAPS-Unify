import { useState } from 'react'
import '../App.css'
import '../import.jsx'

// Components
import { Navbar } from "../components/navbar.jsx"
import { Button } from "../components/button.jsx"
import { RightDrawer } from "../components/rightDrawer.jsx"
import { MainCalendar } from '../components/mainCalendar.jsx'
import { SimpleBlock } from '../components/simpleBlock.jsx'


function HomePage(){

  const [isRightDrawerOpen, toggleRightDrawer] = useState(false) // Defining Right Drawer Open State

  const rightDrawerButton = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 0
  }

  return (
    <div>
      <Navbar>
        <h1 style={{ margin: 0, marginRight: 'auto' }}>Unify</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => toggleRightDrawer(!isRightDrawerOpen)}>Stuff</Button>
        </div>
      </Navbar>

      <RightDrawer rightDrawerOpen={isRightDrawerOpen} onClose={() => toggleRightDrawer(!isRightDrawerOpen)}>
        <div style = {rightDrawerButton}>
          <br></br>
          <br></br>
          <Button>Account (TODO)</Button>
          <Button>Settings (TODO)</Button>
        </div>

      </RightDrawer>

      <MainCalendar />

    </div>

  )

}

export default HomePage