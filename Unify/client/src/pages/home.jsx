import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import { monthOptionsArray, yearOptionsArray } from '../constants/calendarConstants.jsx'
// import getBaseDate from '../functions/getBaseDate.jsx'
import { uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot } from '../classes/'

// Components
import { TopNavbar } from "../components/blocks/TopNavbar.jsx"
import { RightDrawer } from "../components/rightDrawer/RightDrawer.jsx"
import { MainCalendar } from '../components/monthCalender/MainCalendar.jsx'
import { OverlayBlock } from '../components/blocks/OverlayBlock.jsx'
import { DropdownList } from '../components/monthCalender/DropdownList.jsx'
import { TimeTable } from '../components/dayCalender/timeTable.jsx'
import { CreateEvent } from '../components/dayCalender/CreateNewEvent.jsx'
import { RightDrawerCloseBackground } from '../components/rightDrawer/rightDrawerCloseBackground.jsx'
import { EditAccountForm } from '../components/rightDrawer/EditAccounts.jsx'
import { EditCalendarsForm } from '../components/monthCalender/EditCalendars.jsx'
import { OverlayBackground } from '../components/overlay/OverlayBackground.jsx'
import { LeftTabPanel } from '../components/LeftPanel/LeftTabPanel.jsx'
import { ScrollBlock } from '../components/blocks/ScrollBlock.jsx'
import MainLayout from '../components/blocks/MainLayout.jsx'
import { getMyCalendars, getMyEvents, getAllAccounts, getFollowedCalendars } from '../components/LeftPanel/LeftPanelFunctions.jsx'
import { ShowCalendar } from '../components/LeftPanel/ShowCalendar.jsx'
import { ShowAccount } from '../components/LeftPanel/ShowAccount.jsx'
import { ShowEvent } from '../components/LeftPanel/ShowEvent.jsx'
import monthEventsService from '../services/monthEventsService.jsx'
import { EventDisplay } from '../components/EventDisplay.jsx'


function HomePage() {

    const currentUser = sessionStorage.getItem("currentUser"); //Gets Username in sessionStorage from login
    const currentUserAccountId = sessionStorage.getItem("currentUserAccountId"); //Gets Username in sessionStorage from login
    // console.log("Current User: " + currentUser + " Account ID: " + currentUserAccountId)


    // useState creates variables that are saved even when the page re-renders
    // [variable, function to change variable] is the format
    const [isRightDrawerOpen, toggleRightDrawer] = useState(false) // Defining Right Drawer Open State
    const [isEventHidden, toggleEventHidden] = useState(true) // Defining Event Block Open State
    const [isEventFormOpen, setEventFormOpen] = useState(false)
    const [isEditAccountsFormOpen, setEditAccountsFormOpen] = useState(false)
    const [isEditCalendarsFormOpen, setEditCalendarsFormOpen] = useState(false)
    const [calendarDisplay, changeCalendarDisplay] = useState(new Date())
    const [chosenDate, setChosenDate] = useState(new Date())
    const [eventRefreshTrigger, seteventRefreshTrigger] = useState(0)

    const [isEventDetailsOpen, setEventDetailsOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const [isShowCalendarOpen, setShowCalendarOpen] = useState(false)
    const [showCalendarID, setShowCalendarID] = useState('')

    const [isShowAccountsOpen, setShowAccountsOpen] = useState(false)
    const [showAccountID, setShowAccountID] = useState('')

    const [isShowEventOpen, setShowEventOpen] = useState(false)
    const [showEventID, setShowEventID] = useState('')

    const [isOverlayBackgroundHidden, setOverlayBackgroundHidden] = useState(true);
    // const isOverlayBackgroundHidden = isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen && !isShowCalendarOpen && !isShowAccountsOpen && !isShowEventOpen;

    const [myCalendars, setMyCalendars] = useState([]);

    const [followedCalendars, setFollowedCalendars] = useState([])
    const refreshFollowedCalendars = () => {
        getFollowedCalendars(currentUserAccountId).then(setFollowedCalendars);
    };

    const [allAccounts, setAllAccounts] = useState([])

    const [myEvents, setMyEvents] = useState([]);

    useEffect(() => {
        if (currentUserAccountId) {
            getMyCalendars(currentUserAccountId).then(setMyCalendars);

            getAllAccounts(currentUserAccountId).then(setAllAccounts);

            getMyEvents(currentUserAccountId).then(setMyEvents);

            getFollowedCalendars(currentUserAccountId).then(setFollowedCalendars);

        }
    }, [currentUserAccountId]);

    useEffect(() => {
        setOverlayBackgroundHidden(() => {
            return isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen && !isShowCalendarOpen && !isShowAccountsOpen && !isShowEventOpen;
        });

    }, [isEventHidden, isRightDrawerOpen, isEventFormOpen, isEditCalendarsFormOpen, isEditAccountsFormOpen, isShowCalendarOpen, isShowAccountsOpen, isShowEventOpen]);

    // console.log("Followed Calendars: ", followedCalendars);
    // console.log("My Events: ", myEvents);
    // console.log("My Calendars: ", myCalendars);
    // console.log("All Accounts: ", allAccounts);


    // console.log("Chosen Date: ", chosenDate);
    const [refreshMonthEvents, setRefreshMonthEvents] = useState(0)
    const [monthEvents, setMonthEvents] = useState([])

    useEffect(() => { //refreshes month events; display updated events on month calender
        const fetchMonthEvents = async () => {
            try {
                const currMonth = calendarDisplay.getMonth()
                const monthEvents = await monthEventsService.getMonthEvents({ currMonth: currMonth });
                setMonthEvents(monthEvents.data);
            } catch (err) {
                console.error("Error fetching month events: ", err);
            }
        }
        fetchMonthEvents();
    }, [refreshMonthEvents])

    const hideOverlayBackground = () => {
        toggleEventHidden(true)
        toggleRightDrawer(false)
        setEventFormOpen(false)
        setEditAccountsFormOpen(false)
        setEditCalendarsFormOpen(false)
        setShowCalendarOpen(false)
        setShowAccountsOpen(false)
        setShowEventOpen(false)
        setEventDetailsOpen(false)

    }

    // Defining the uCalendarDisplay object that the page will use to update the Main Calendar.
    // the date object is the current time

    // These are all styles for the contents of the right drawer. It's not really what I want but I am too lazy to do more css.
    const drawerStyle = {
        height: '100%',
        width: '100%',
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
        padding: 30
    }

    return (
        <div>

            <OverlayBackground
                isHidden={isOverlayBackgroundHidden}
                onClick={() => hideOverlayBackground()}>
            </OverlayBackground>

            <TopNavbar isRightDrawerOpen={isRightDrawerOpen} toggleRightDrawer={toggleRightDrawer}></TopNavbar>



            {/* <RightDrawerCloseBackground isRightDrawerOpen={isRightDrawerOpen} toggleRightDrawer={toggleRightDrawer}></RightDrawerCloseBackground> */}

            <RightDrawer
                rightDrawerOpen={isRightDrawerOpen} // assigns isRightDrawer state
                onClose={() => hideOverlayBackground()} // assigns toggleRightDrawer function
            >
                <div style={drawerStyle}>
                    <div style={rightDrawerButtonTop}>
                        <br></br>
                        {/*FOR BEV TO EDIT*/}
                        <h3>Current User: {currentUser} &nbsp; 
                        <br></br>
                            Account ID: {currentUserAccountId}</h3>
                        
                        {/*
                        NOT NEEDED ANYMORE 
                        <button onClick={() => setEditAccountsFormOpen(!isEditAccountsFormOpen)}>Edit Account (Admin use)</button>
                        <br></br>
                        <br></br>
                        <button onClick={() => setEditCalendarsFormOpen(!isEditCalendarsFormOpen)}>Edit Calendar</button>
                        */}
                    </div> 

                    <div style={rightDrawerButtonBottom}>

                        <button style={{
                            backgroundColor: '#A78E72', // Dark brown color
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}><Link to="/" style={{color:'white'}}>Sign Out</Link></button> {/* Button at the bottom to return to login page */}
                    </div>
                </div>
            </RightDrawer>



            <MainLayout
                leftPanel={<LeftTabPanel
                    tabs={[
                        { id: '1', label: 'Calendars' },
                        { id: '2', label: 'Accounts' },
                        { id: '3', label: 'Events' }
                    ]}
                    tabContents={
                        {
                            1:
                                <>
                                    <ScrollBlock height='48%'
                                        buttonData={myCalendars.map((calendar) => ({
                                            label: calendar.calendarname,
                                            onClick: () => {

                                                setShowCalendarID(calendar.calendarid)
                                                setTimeout(() => {
                                                    setShowCalendarOpen(true)
                                                }, 100)
                                            }
                                        }))}
                                    >
                                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>My Calendars</h2>
                                    </ScrollBlock>
                                    <br></br>
                                    <ScrollBlock height='48%'
                                        buttonData={followedCalendars.map((calendar) => ({
                                            label: calendar.calendarname,
                                            onClick: () => {
                                                setShowCalendarID(calendar.calendarid)
                                                setTimeout(() => {
                                                    setShowCalendarOpen(true)
                                                }, 100)
                                            }
                                        }))}>
                                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Followed Calendars</h2>
                                    </ScrollBlock>
                                </>
                            ,
                            2:
                                <ScrollBlock
                                    buttonData={allAccounts.map((account) => ({
                                        label: account.accountusername,
                                        onClick: () => {
                                            setShowAccountID(account.accountid)
                                            setTimeout(() => {
                                                setShowAccountsOpen(true)
                                            }, 100)
                                        }
                                    }))}
                                    height='100%'
                                >
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Accounts</h2>

                                </ScrollBlock>
                            ,
                            3:
                                <ScrollBlock>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>My Events</h2>
                                    {myCalendars.map((calendar) => (
                                        <ScrollBlock
                                            key={calendar.calendarid}
                                            height='40%'
                                            buttonData={myEvents[calendar.calendarid]?.map((event) => ({
                                                label: event.eventname,
                                                onClick: () => {
                                                    setShowEventID(event.eventid)
                                                    setTimeout(() => {
                                                        setShowEventOpen(true)
                                                    }, 100)
                                                }
                                            }))}
                                        >

                                            <h3>{calendar.calendarname}</h3>

                                        </ScrollBlock>
                                    ))}

                                </ScrollBlock>
                        }
                    }
                />}
                mainContent={
                    <div className='calendar-wrapper'>
                        <div className='main-content-centered'>
                            <DropdownList
                                optionArray={monthOptionsArray} // Assigns the options to the month dropdown list
                                value={calendarDisplay.getMonth()} // Assigns the default value of the list to the current month
                                onChange={(event) => {
                                    changeCalendarDisplay(
                                        new Date(
                                            calendarDisplay.getFullYear(),
                                            Number(event.target.value),
                                            calendarDisplay.getDate()
                                    
                                    )) // Whenever a user changes the list, the calendar display (a uCalendarDisplay object) will update and the components that use it will re-render, updating main calendar
                                    setRefreshMonthEvents(refreshMonthEvents + 1);
                                    console.log("Events Refreshed!");
                                }}
                            />
                            <DropdownList
                                optionArray={yearOptionsArray} // Assigns the options to the year dropdown list
                                value={calendarDisplay.getFullYear()} // Assigns the default value of the list to the current year
                                onChange={(event) => {
                                    changeCalendarDisplay(
                                        new Date(
                                            Number(event.target.value),
                                            calendarDisplay.getMonth(),
                                            calendarDisplay.getDate()
                                
                                    )); // Whenever a user changes the list, the calendar display (a uCalendarDisplay object) will update and the components that use it will re-render, updating main calendar
                                    setRefreshMonthEvents(refreshMonthEvents + 1);
                                    console.log("Events Refreshed!");
                                }}
                            />

                            <MainCalendar
                                displayDate={calendarDisplay} // Assigns the date to display (in month format) as the date in the calendarDisplay state
                                onDateBoxClick={(date) => {
                                    setChosenDate(date)
                                    setTimeout(() => {
                                        toggleEventHidden(!isEventHidden)
                                    }, 100);
                                }
                                } // Gives the dateboxes some functionality to open an Overlay block
                                refreshMonthEvents={refreshMonthEvents}
                                setRefreshMonthEvents={setRefreshMonthEvents}
                                monthEvents={monthEvents}
                                setMonthEvents={setMonthEvents}
                                setChosenDate={setChosenDate}
                            />
                        </div>
                    </div>
                }
            >

            </MainLayout>

            <OverlayBlock
                isHidden={!isShowEventOpen}
                onClose={() => hideOverlayBackground()}>
                <ShowEvent
                    eventid={showEventID}>
                </ShowEvent>
            </OverlayBlock>

            <OverlayBlock
                isHidden={!isShowCalendarOpen}
                onClose={() => hideOverlayBackground()}>
                <ShowCalendar
                    calendarid={showCalendarID}
                    accountid={currentUserAccountId}
                    setShowCalendarOpen={setShowCalendarOpen}
                    setShowAccountID={setShowAccountID}
                    setShowAccountOpen={setShowAccountsOpen}
                    setShowEventID={setShowEventID}
                    setShowEventOpen={setShowEventOpen}
                    refreshFollowedCalendars={refreshFollowedCalendars}>

                </ShowCalendar>

            </OverlayBlock>

            <OverlayBlock
                isHidden={!isShowAccountsOpen}
                onClose={() => hideOverlayBackground()}>
                <ShowAccount
                    accountid={showAccountID}
                    setShowCalendarID={setShowCalendarID}
                    setShowCalendarOpen={setShowCalendarOpen}
                    setShowAccountOpen={setShowAccountsOpen}
                >
                </ShowAccount>

            </OverlayBlock>



            <OverlayBlock
                isHidden={isEventHidden} // Assigns isEventHidden function
                onClose={() => hideOverlayBackground()} // Assigns toggleEventHidden function
            >
                < TimeTable chosenDate={chosenDate} refreshTrigger={eventRefreshTrigger} eventselector={setSelectedEvent} setEventDetailsOpen={setEventDetailsOpen}>
                </TimeTable>
                <button onClick={() => {
                    // console.log("Button clicked!")
                    setEventFormOpen(true)
                }}>+ Add Event</button>

            </OverlayBlock>

            {isEventDetailsOpen && selectedEvent && (
                <OverlayBlock onClose={() => setEventDetailsOpen(false)}>
                    <EventDisplay displayedEvent = {selectedEvent}/>
                </OverlayBlock>
            )}

            {/* ADD event overlay block */}
            {
                isEventFormOpen && (
                    <OverlayBlock
                        isHidden={false}
                        onClose={() => setEventFormOpen(false)}>
                        <CreateEvent onClose={() => hideOverlayBackground()}
                            onSave={() => {
                                setEventFormOpen(false);
                                seteventRefreshTrigger(prev => prev + 1);
                            }}
                            chosenDate={chosenDate}
                            accountid={currentUserAccountId} />
                    </OverlayBlock>
                )
            }

            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditAccountsFormOpen}>
                <EditAccountForm onClose={() => hideOverlayBackground()} />
            </OverlayBlock>

            {/* nic's edit accounts form */}


            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditCalendarsFormOpen}>
                <EditCalendarsForm onClose={() => hideOverlayBackground()} currentAccountId={currentUserAccountId} />
            </OverlayBlock>
        </div >
    )
}

export default HomePage // Means that home.jsx only exports HomePage