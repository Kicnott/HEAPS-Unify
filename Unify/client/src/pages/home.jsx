import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
// import getBaseDate from '../functions/getBaseDate.jsx'
import { uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot } from '../classes/'

// Components
import { TopNavbar } from "../components/TopNavbar.jsx"
import { RightDrawer } from "../components/rightDrawer.jsx"
import { MainCalendar } from '../components/MainCalendar.jsx'
import { OverlayBlock } from '../components/OverlayBlock.jsx'
import { DropdownList } from '../components/DropdownList.jsx'
import { TimeTable } from '../components/timeTable.jsx'
import { CreateEvent } from '../components/CreateNewEvent.jsx'
import { RightDrawerCloseBackground } from '../functions/rightDrawerCloseBackground'
import { EditAccountForm } from '../components/EditAccounts.jsx'
import { EditCalendarsForm } from '../components/EditCalendars.jsx'
import { OverlayBackground } from '../components/OverlayBackground.jsx'

function HomePage() {

    const currentUser = sessionStorage.getItem("currentUser"); //Gets Username in sessionStorage from login
    const currentUserAccountId = sessionStorage.getItem("currentUserAccountId"); //Gets Username in sessionStorage from login

    // Dummy Data

    // uTimeslot(startDT, endDT)
    var T2 = new uTimeslot("2025-06-18T02:00:00Z", "2025-06-18T05:00:00Z"); // 2am–5am UTC  10:00 AM – 1:00 PM
    var T3 = new uTimeslot("2025-06-18T07:00:00Z", "2025-06-18T10:00:00Z"); // 7am–10am UTC 3:00 PM – 6:00 PM
    var T4 = new uTimeslot("2025-06-19T13:00:00Z", "2025-06-19T20:00:00Z"); // 1pm–8pm UTC 9:00 PM - 4:00 AM
    var T5 = new uTimeslot("2025-06-18T16:00:00Z", "2025-06-18T21:00:00Z"); // 12am–5am SGT on June 19


    // uEvent(timeslots, id, name, description, location)
    var E2 = new uEvent(T2, 2, "Event 2", "Fun and cool event", "Marina Bay Sands");
    var E3 = new uEvent(T3, 3, "Event 3", "Fun and cool event", "Marina Bay Sands");
    var E4 = new uEvent(T4, 4, "Event 4", "Fun and cool event", "Marina Bay Sands");
    var E5 = new uEvent(T5, 5, "Event 5", "Fun and cool event", "Marina Bay Sands");


    // uCalendar(events, id, name, description, colour)
    var C1 = new uCalendar([E2], 1, "myCalendar", "This is my calendar", "#ff0000")
    // uAccount(id, name, description, myCalendar, followedCalendars)
    var A1 = new uAccount(1, "Me", "This is my Account", [C1], [])
    // uCalendarDisplay (displayDate, calendars, currentAccount) 
    // var CD1 = new uCalendarDisplay(new Date(2025, 7, 7), C1, A1)

    // useState creates variables that are saved even when the page re-renders
    // [variable, function to change variable] is the format
    const [isRightDrawerOpen, toggleRightDrawer] = useState(false) // Defining Right Drawer Open State
    const [isEventHidden, toggleEventHidden] = useState(true) // Defining Event Block Open State
    const [isEventFormOpen, setEventFormOpen] = useState(false)
    const [isEditAccountsFormOpen, setEditAccountsFormOpen] = useState(false)
    const [isEditCalendarsFormOpen, setEditCalendarsFormOpen] = useState(false)
    const [calendarDisplay, changeCalendarDisplay] = useState(new uCalendarDisplay(new Date(), C1, A1))
    const [chosenDate, setChosenDate] = useState(new Date())
    const [eventRefreshTrigger, seteventRefreshTrigger] = useState(0)
    const isOverlayBackgroundHidden = isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen

    const hideOverlayBackground = () => {
        toggleEventHidden(true)
        toggleRightDrawer(false)
        setEventFormOpen(false)
        setEditAccountsFormOpen(false)
        setEditCalendarsFormOpen(false)
    }

    // Defining the uCalendarDisplay object that the page will use to update the Main Calendar.
    // the date object is the current time

    // These are all styles for the contents of the right drawer. It's not really what I want but I am too lazy to do more css.
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

    const monthOptionsArray = [
        { value: "0", label: "January" },
        { value: "1", label: "February" },
        { value: "2", label: "March" },
        { value: "3", label: "April" },
        { value: "4", label: "May" },
        { value: "5", label: "June" },
        { value: "6", label: "July" },
        { value: "7", label: "August" },
        { value: "8", label: "September" },
        { value: "9", label: "October" },
        { value: "10", label: "November" },
        { value: "11", label: "December" }
    ] // The options to be stored in the month drop down list.

    const yearOptionsArray = [] // Defining an empty options array for the year drop down list.
    for (let i = 1970; i < 2051; i++) {
        yearOptionsArray.push({ value: String(i), label: String(i) })
    } // The options to be stored in the year drop down list. It is too long so using a for loop to push the values in from 1970 to 2050.

    const whenDisplayRenders = () => {
        console.log("Calender is rendered!")
    }

    return (
        <div>
                {whenDisplayRenders()}
                
            <h3>Current User: {currentUser} &nbsp; Account ID: {currentUserAccountId}</h3>

            <OverlayBackground
                isHidden={isOverlayBackgroundHidden}
                onClick={() => hideOverlayBackground()}>
            </OverlayBackground>

            <TopNavbar isRightDrawerOpen={isRightDrawerOpen} toggleRightDrawer={toggleRightDrawer}></TopNavbar>

            <RightDrawerCloseBackground isRightDrawerOpen={isRightDrawerOpen} toggleRightDrawer={toggleRightDrawer}></RightDrawerCloseBackground>

            <RightDrawer
                rightDrawerOpen={isRightDrawerOpen} // assigns isRightDrawer state
                onClose={() => toggleRightDrawer(!isRightDrawerOpen)} // assigns toggleRightDrawer function
            >
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
                        <br></br>
                        <br></br>
                        <button onClick={() => setEditAccountsFormOpen(!isEditAccountsFormOpen)}>Edit Account (Admin use)</button>
                    </div> {/* TODO all these buttons */}

                    <div style={rightDrawerButtonBottom}>
                        <button><Link to="/">Sign Out</Link></button> {/* Button at the bottom to return to login page */}
                    </div>
                </div>
            </RightDrawer>

            <DropdownList
                optionArray={monthOptionsArray} // Assigns the options to the month dropdown list
                value={calendarDisplay.getDisplayDate().getMonth()} // Assigns the default value of the list to the current month
                onChange={(event) => {
                    changeCalendarDisplay(new uCalendarDisplay(
                        new Date(
                            calendarDisplay.getDisplayDate().getFullYear(),
                            Number(event.target.value),
                            calendarDisplay.getDisplayDate().getDate()
                        )
                    )
                    ) // Whenever a user changes the list, the calendar display (a uCalendarDisplay object) will update and the components that use it will re-render, updating main calendar
                }}
            />
            <DropdownList
                optionArray={yearOptionsArray} // Assigns the options to the year dropdown list
                value={calendarDisplay.getDisplayDate().getFullYear()} // Assigns the default value of the list to the current year
                onChange={(event) => {
                    changeCalendarDisplay(new uCalendarDisplay(
                        new Date(
                            Number(event.target.value),
                            calendarDisplay.getDisplayDate().getMonth(),
                            calendarDisplay.getDisplayDate().getDate()
                        )
                    )
                    ) // Whenever a user changes the list, the calendar display (a uCalendarDisplay object) will update and the components that use it will re-render, updating main calendar
                }}
            />

            <MainCalendar
                displayDate={calendarDisplay.getDisplayDate()} // Assigns the date to display (in month format) as the date in the calendarDisplay state
                onDateBoxClick={() => toggleEventHidden(!isEventHidden)} // Gives the dateboxes some functionality to open an Overlay block
                setChosenDate={setChosenDate}
            >
            </MainCalendar>


            {/* My section TODO */}
            {/* {!isEventHidden && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 1000
                    }}
                    onClick={() => toggleEventHidden(!isEventHidden)} // Lets you click background to close overlay block
                /> // When isEventHidden is false, creates an overlay background over the other components */}
            {/* )} */}

            <OverlayBlock
                isHidden={isEventHidden} // Assigns isEventHidden function
                onClose={() => toggleEventHidden(!isEventHidden)} // Assigns toggleEventHidden function
            >

                < TimeTable chosenDate={chosenDate} refreshTrigger={eventRefreshTrigger}>
                </TimeTable>
                <button onClick={() => {
                    console.log("Button clicked!")
                    setEventFormOpen(true)
                }}>+ Add Event</button>

            </OverlayBlock>

            {/* ADD event overlay block */}
            {isEventFormOpen && (
                <OverlayBlock
                    isHidden={false}
                    onClose={() => setEventFormOpen(false)}>
                    <CreateEvent onClose={() => setEventFormOpen(false)}
                        onSave={() => {
                            setEventFormOpen(false);
                            seteventRefreshTrigger(prev => prev + 1);
                        }}
                        chosenDate={chosenDate}
                        accountID={currentUserAccountId} />
                </OverlayBlock>
            )}

            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditAccountsFormOpen}>
                <EditAccountForm onClose={() => setEditAccountsFormOpen(false)} />
            </OverlayBlock>

            {/* nic's edit accounts form */}
            <button onClick={() => setEditCalendarsFormOpen(!isEditCalendarsFormOpen)}>Edit Calendar</button>

            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditCalendarsFormOpen}>
                <EditCalendarsForm onClose={() => setEditCalendarsFormOpen(false)} currentAccountId={currentUserAccountId} />
            </OverlayBlock>
        </div>
    )
}

export default HomePage // Means that home.jsx only exports HomePage