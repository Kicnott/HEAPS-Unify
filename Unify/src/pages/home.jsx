import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import getBaseDate from '../functions/getBaseDate.jsx'
import  {uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot} from '/src/classes/'

// Components
import { Navbar } from "../components/top_navbar.jsx"
import { Button } from "../components/button.jsx"
import { RightDrawer } from "../components/rightDrawer.jsx"
import { MainCalendar } from '../components/mainCalendar.jsx'
import { SimpleBlock } from '../components/simpleBlock.jsx'


function HomePage() {

    // Dummy Data

    // uTimeslot(startDT, endDT)
    var T1 = new uTimeslot("2025-07-12T02:00:00Z", "2025-07-14T12:00:00Z")
    // uEvent(timeslots, id, name, description, location)
    var E1 = new uEvent([T1], 1, "Event 1", "Fun and cool event", "Marina Bay Sands")
    // uCalender(events, id, name, description, colour)
    var C1 = new uCalendar([E1], 1, "myCalendar", "This is my calendar", "#ff0000")
    // uAccount(id, name, description, myCalendar, followedCalendars)
    var A1 = new uAccount(1, "Me", "This is my Account", [C1], [])
    // uCalenderDisplay (displayDate, calendars, currentAccount) 
    var CD1 = new uCalendarDisplay(new Date(), C1, A1)

    let baseDate = getBaseDate(CD1)

    // console.log(baseDate)


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

            <MainCalendar baseDate={baseDate}>

            </MainCalendar>

        </div>

    )

}

export default HomePage