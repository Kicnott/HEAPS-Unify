import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../import.jsx'

// Components
import { Navbar } from "../components/navbar.jsx"
import { Button } from "../components/button.jsx"
import { RightDrawer } from "../components/rightDrawer.jsx"
import { MainCalendar } from '../components/mainCalendar.jsx'
import { SimpleBlock } from '../components/simpleBlock.jsx'


function HomePage() {

    const [isRightDrawerOpen, toggleRightDrawer] = useState(false) // Defining Right Drawer Open State

    const drawerStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
    }
    const rightDrawerButtonTop = {
        padding: 0,
        flex: 1
    }
        const rightDrawerButtonBottom = {
        marginTop: 'auto',
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
                <div style={drawerStyle}>
                <div style={rightDrawerButtonTop}>
                    <br></br>
                    <br></br>
                    <Button>Account (TODO)</Button>
                    <br></br>
                    <br></br>
                    <Button>Settings (TODO)</Button>
                    <br></br>
                    <br></br>
                    <Button>Events (TODO)</Button>
                </div>

                <div style={rightDrawerButtonBottom}>
                    <Button><Link to="/">Sign Out</Link></Button>
                </div>
                </div>
            </RightDrawer>

            <MainCalendar>
                
            </MainCalendar>

        </div>

    )

}

export default HomePage