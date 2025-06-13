import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import getBaseDate from '../functions/getBaseDate.jsx'
import { uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot } from '/src/classes/'

// Components
import { Navbar } from "../components/top_navbar.jsx"
import { RightDrawer } from "../components/RightDrawer.jsx"
import { MainCalendar } from '../components/mainCalendar.jsx'
import { OverlayBlock } from '../components/overlayBlock.jsx'


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
    var CD1 = new uCalendarDisplay(new Date(2025, 7, 7), C1, A1)

    let baseDate = getBaseDate(CD1)

    // console.log(baseDate)


    const [isRightDrawerOpen, toggleRightDrawer] = useState(false) // Defining Right Drawer Open State
    const [isEventHidden, toggleEventHidden] = useState(true) // Defining Event Block Open State

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
                    <button onClick={() => toggleRightDrawer(!isRightDrawerOpen)}>Stuff</button>
                </div>
            </Navbar>
            {isRightDrawerOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 1000
                    }}
                    onClick={() => toggleRightDrawer(!isRightDrawerOpen)} // Optional: click background to close
                />
            )}
            <RightDrawer rightDrawerOpen={isRightDrawerOpen} onClose={() => toggleRightDrawer(!isRightDrawerOpen)}>
                <div style={drawerStyle}>
                    <div style={rightDrawerButtonTop}>
                        <br></br>
                        <br></br>
                        <button>Account (TODO)</button>
                        <br></br>
                        <br></br>
                        <button>Settings (TODO)</button>
                        <br></br>
                        <br></br>
                        <button>Events (TODO)</button>
                    </div>

                    <div style={rightDrawerButtonBottom}>
                        <button><Link to="/">Sign Out</Link></button>
                    </div>
                </div>
            </RightDrawer>

            <MainCalendar baseDate={baseDate} onButtonClick={() => toggleEventHidden(!isEventHidden)}>

            </MainCalendar>
            {!isEventHidden && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 1000
                    }}
                    onClick={() => toggleEventHidden(!isEventHidden)} // Optional: click background to close
                />
            )}
            <OverlayBlock isHidden={isEventHidden} onClose={() => toggleEventHidden(!isEventHidden)}>
                Hello!
            </OverlayBlock>

        </div>

    )

}

export default HomePage