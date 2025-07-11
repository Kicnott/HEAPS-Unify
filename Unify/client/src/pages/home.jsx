import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import { monthOptionsArray, yearOptionsArray } from '../constants/calendarConstants.jsx'
// import getBaseDate from '../functions/getBaseDate.jsx'
import { uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot } from '../classes/'

// Components
import { TopNavbar } from "../components/blocks/TopNavbar.jsx"
import { RightDrawer } from "../components/rightDrawer/RightDrawer.jsx"
import { MainCalendar } from '../components/monthCalendar/MainCalendar.jsx'
import { OverlayBlock } from '../components/blocks/OverlayBlock.jsx'
import { DropdownList } from '../components/monthCalendar/DropdownList.jsx'
import { TimeTable } from '../components/dayCalender/timeTable.jsx'
import { CreateEvent } from '../components/dayCalender/CreateNewEvent.jsx'
import { RightDrawerCloseBackground } from '../components/rightDrawer/rightDrawerCloseBackground.jsx'
import { EditAccountForm } from '../components/rightDrawer/EditAccounts.jsx'
import { EditCalendarsForm } from '../components/monthCalendar/EditCalendars.jsx'
import { OverlayBackground } from '../components/overlay/OverlayBackground.jsx'
import { LeftTabPanel } from '../components/LeftPanel/LeftTabPanel.jsx'
import { ScrollBlock } from '../components/blocks/ScrollBlock.jsx'
import MainLayout from '../components/blocks/MainLayout.jsx'
import { getMyCalendars, getMyEvents, getAllAccounts, getFollowedCalendars, getMyDisplayedCalendars } from '../components/LeftPanel/LeftPanelFunctions.jsx'
import { ShowCalendar } from '../components/LeftPanel/ShowCalendar.jsx'
import { ShowAccount } from '../components/LeftPanel/ShowAccount.jsx'
import { ShowEvent } from '../components/LeftPanel/ShowEvent.jsx'
import monthEventsService from '../services/monthEventsService.jsx'
import calendarService from '../services/calendarService.jsx'
import { EventDisplay } from '../components/EventDisplay.jsx'
import { CreateCalendar } from '../components/LeftPanel/CreateCalendar.jsx'
import { ExtraEventsPopUp } from '../components/blocks/ExtraEventsPopUp.jsx'
import { EventsOverlayBackground } from '../components/overlay/EventsOverlayBackground.jsx'
import { drawerStyle, rightDrawerButtonTop, rightDrawerButtonBottom } from '../styles/rightDrawerStyles.jsx'


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

    const [isCreateCalendarOpen, setCreateCalendarOpen] = useState(false)
    const [mainRefreshTrigger, setMainRefreshTrigger] = useState(0)

    const [myDisplayedCalendarIds, setMyDisplayedCalendarIds] = useState([])

    // If sessionStorage for currMonth and currYear are not defined, assign calendarDisplay to current time. Important to retain session currMonth and currYear after each refresh.
    const [calendarDisplay, changeCalendarDisplay] = useState((sessionStorage.getItem("currYear") && sessionStorage.getItem("currMonth")) ? new Date(sessionStorage.getItem("currYear"), sessionStorage.getItem("currMonth"), 1) : new Date())

    const [isExtraEventsPopUpOpen, setExtraEventsPopUp] = useState(false);

    const [refreshMonthEvents, setRefreshMonthEvents] = useState(0)
    const [monthEvents, setMonthEvents] = useState([])

    const [extraEvents, setExtraEvents] = useState([]);
    const [popUpPosition, setPopUpPosition] = useState({ x: 0, y: 0 });

    const [isOverlayBackgroundHidden, setOverlayBackgroundHidden] = useState(true);
    const [isExtraOverlayBackgroundHidden, setExtraOverlayBackgroundHidden] = useState(true);

    const [myCalendars, setMyCalendars] = useState([]);
    
    const [followedCalendars, setFollowedCalendars] = useState([])
    const refreshFollowedCalendars = () => {
        getFollowedCalendars(currentUserAccountId).then(setFollowedCalendars);
    };

    const [allAccounts, setAllAccounts] = useState([])

    // for left panel display
    const [myEvents, setMyEvents] = useState([]);

    // Function to update displayed calendar year
    const handleOnYearChange = (event) => {
        const newDate = new Date(
            Number(event),
            calendarDisplay.getMonth(),
            calendarDisplay.getDate()
        )
        changeCalendarDisplay(newDate);
        sessionStorage.setItem("currYear", newDate.getFullYear());
        setRefreshMonthEvents(refreshMonthEvents + 1);
        // console.log("Events Refreshed!");
    }

    // Function to update displayed calendar year
    const handleOnMonthChange = (event) => {
        const newDate = new Date(
            calendarDisplay.getFullYear(),
            Number(event),
            calendarDisplay.getDate()
        )
        changeCalendarDisplay(newDate); 
        sessionStorage.setItem("currMonth", newDate.getMonth());
        setRefreshMonthEvents(refreshMonthEvents + 1);
        // console.log("Events Refreshed!");
    }

    // populate currMonth and currYear session data
    useEffect(() => {
        if (sessionStorage.getItem("currMonth") || sessionStorage.getItem("currYear")){
            handleOnMonthChange(calendarDisplay.getMonth());
            handleOnYearChange(calendarDisplay.getFullYear());            
        }
    }, [])

    // UseState for clicked calendars to display
/*     useEffect(() => {
        if (Object.keys(displayCalendarBasedOnIDAndColour).length !== 0) {
            console.log("AHHHHHHHHHHHHHHHHHHHHHHH")
            let filteredEvents = [];
            for (const [id, colour] of Object.entries(displayCalendarBasedOnIDAndColour)) {
                const matchedEvents = monthEvents
                    .filter(event => event.calendarid === id)
                    .map(event => ({
                        ...event,
                        eventcolour: colour
                    }));
                filteredEvents = filteredEvents.concat(matchedEvents);
            }
            setMonthEvents(filteredEvents);
            setRefreshMonthEvents(prev => prev + 1);
        }
    }, [displayCalendarBasedOnIDAndColour]); */


    useEffect(() => {
        if (currentUserAccountId) {
            getMyCalendars(currentUserAccountId).then((calendars) => {
                const sortedCalendars = calendars.sort((a, b) => a.calendarid - b.calendarid);
                setMyCalendars(sortedCalendars);
            });

            getAllAccounts(currentUserAccountId).then((accounts) => {
                const sortedAccounts = accounts.sort((a, b) => a.accountid - b.accountid);
                setAllAccounts(sortedAccounts);
            });

            getFollowedCalendars(currentUserAccountId).then((calendars) => {
                const sortedCalendars = calendars.sort((a, b) => a.calendarid - b.calendarid);
                setFollowedCalendars(sortedCalendars);
            });

            getMyEvents(currentUserAccountId).then(setMyEvents);

            getMyDisplayedCalendars(currentUserAccountId).then(setMyDisplayedCalendarIds)

        }
    }, [currentUserAccountId, mainRefreshTrigger]);

    // hides background when overlay is hidden
    useEffect(() => {
        setOverlayBackgroundHidden(() => {
            return isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen && !isShowCalendarOpen && !isShowAccountsOpen && !isShowEventOpen && !isCreateCalendarOpen;
        });
        setExtraOverlayBackgroundHidden(() => {
            return !isExtraEventsPopUpOpen;
        });

    }, [isEventHidden, isExtraEventsPopUpOpen, isRightDrawerOpen, isEventFormOpen, isEditCalendarsFormOpen, isEditAccountsFormOpen, isShowCalendarOpen, isShowAccountsOpen, isShowEventOpen, isCreateCalendarOpen]);

    // refreshes month events; display updated events on month calender
    useEffect(() => { 
        const fetchMonthEvents = async () => {
            try {
                const currMonth = calendarDisplay.getMonth();
                const monthEvents = await monthEventsService.getMonthEvents({currMonth: currMonth});
                const matchedIdEvents = monthEvents.data.filter((event) => {
                    return myDisplayedCalendarIds.includes(event.calendarid)
                })

                setMonthEvents(matchedIdEvents);
            } catch (err) {
                console.error("Error fetching month events: ", err);
            }
        }
        fetchMonthEvents();
    }, [refreshMonthEvents, myDisplayedCalendarIds])

    // When the user exits an overlay, the following code turns off all overlays
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
        setCreateCalendarOpen(false)
        setExtraEventsPopUp(false)
    }

    const hideExtraOverlayBackground = () => {
        toggleEventHidden(true)
        toggleRightDrawer(false)
        setEventFormOpen(false)
        setEditAccountsFormOpen(false)
        setEditCalendarsFormOpen(false)
        setShowCalendarOpen(false)
        setShowAccountsOpen(false)
        setShowEventOpen(false)
        setEventDetailsOpen(false)
        setExtraEventsPopUp(false)
    }

    async function onCalendarCheckboxChange(calendarid, accountid) {
        if (myDisplayedCalendarIds.includes(calendarid)) {
            const res = await calendarService.undisplayCalendar(calendarid, accountid)
            if (res.data.status) {
                getMyDisplayedCalendars(currentUserAccountId).then(setMyDisplayedCalendarIds)
            }
            else {
                console.error("Error undisplaying calendar!")
            }
        }
        else {
            const res = await calendarService.displayCalendar(calendarid, accountid)
            if (res.data.status) {
                getMyDisplayedCalendars(currentUserAccountId).then(setMyDisplayedCalendarIds)
            }
            else {
                console.error("Error displaying calendar!")
            }
        }
    }

    async function colorChangeComplete(color, calendarid) {
        const res = await calendarService.changeCalendarColor(color, calendarid);
        if (res.data.status) {
            setTimeout(() => { setMainRefreshTrigger(prev => prev + 1); }, 100);
        }
    }

    // Defining the uCalendarDisplay object that the page will use to update the Main Calendar.
    // the date object is the current time

    return (
        <div>
            {isExtraEventsPopUpOpen && (
                <ExtraEventsPopUp
                    onClose={() => hideOverlayBackground()}
                    extraEvents={extraEvents}
                    popUpPosition={popUpPosition}>
                </ExtraEventsPopUp>
            )
            }

            <EventsOverlayBackground
                isHidden={isExtraOverlayBackgroundHidden}
                onClick={() => hideExtraOverlayBackground()}>
            </EventsOverlayBackground>

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
                        }}><Link to="/" style={{ color: 'white' }}>Sign Out</Link></button> {/* Button at the bottom to return to login page */}
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
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: '2px solid black',
                                        paddingBottom: '8px',
                                        marginBottom: '16px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            margin: 0,
                                            flex: 1,
                                            lineHeight: 1
                                        }}>
                                            My Calendars
                                        </h2>
                                        <button
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                padding: 0,
                                                borderRadius: '50%',
                                                background: '#fff',
                                                border: '1.5px solid #d1d5db',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s, border 0.15s, box-shadow 0.15s',
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.background = '#f3f4f6';
                                                e.currentTarget.style.border = '1.5px solid #a3a3a3';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.border = '1.5px solid #d1d5db';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                            onClick={() => { setCreateCalendarOpen(true) }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                                <rect x="6" y="2" width="2" height="10" rx="1" fill="#222" />
                                                <rect x="2" y="6" width="10" height="2" rx="1" fill="#222" />
                                            </svg>
                                        </button>
                                    </div>
                                    <ScrollBlock
                                        height='40.5%'
                                        buttonData={myCalendars.map((calendar) => ({
                                            label: calendar.calendarname,
                                            id: calendar.calendarid,
                                            color: calendar.calendarcolour,
                                            onClick: () => {
                                                setShowCalendarID(calendar.calendarid)
                                                setTimeout(() => {
                                                    setShowCalendarOpen(true)
                                                }, 100)
                                            }
                                        }))}
                                        gotColour={true}
                                        checkboxButton={true}
                                        checkboxName='myCalendars'
                                        accountid={currentUserAccountId}
                                        onCheckboxChange={onCalendarCheckboxChange}
                                        colorChangeComplete={colorChangeComplete}
                                        refreshTrigger={setMainRefreshTrigger}
                                        myDisplayedCalendarIds={myDisplayedCalendarIds} >

                                    </ScrollBlock>
                                    <br></br>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: '2px solid black',
                                        paddingBottom: '8px',
                                        marginBottom: '16px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            margin: 0,
                                            flex: 1,
                                            lineHeight: 1
                                        }}>
                                            Followed Calendars
                                        </h2>
                                    </div>
                                    <ScrollBlock height='40.5%'
                                        buttonData={followedCalendars.map((calendar) => ({
                                            label: calendar.calendarname,
                                            id: calendar.calendarid,
                                            color: calendar.calendarcolour,
                                            onClick: () => {
                                                setShowCalendarID(calendar.calendarid)
                                                setTimeout(() => {
                                                    setShowCalendarOpen(true)
                                                }, 100)
                                            }
                                        }))}
                                        checkboxButton={true}
                                        gotColour={true}
                                        colorChangeComplete={colorChangeComplete}
                                        checkboxName='myCalendars'
                                        accountid={currentUserAccountId}
                                        onCheckboxChange={onCalendarCheckboxChange}
                                        refreshTrigger={setMainRefreshTrigger}
                                        myDisplayedCalendarIds={myDisplayedCalendarIds}>
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
                                <>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>My Events</h2>
                                    <ScrollBlock
                                        height='40%'>
                                        {myCalendars.map((calendar) => (
                                            <div
                                                key={calendar.calendarid}
                                                style={{
                                                    marginBottom: '16px'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        borderBottom: '2px solid black',
                                                        paddingBottom: '8px',
                                                        marginBottom: '16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            fontSize: '24px',
                                                            fontWeight: 'bold',
                                                            margin: 0,
                                                            flex: 1, // This makes the heading take all available space
                                                            lineHeight: 'normal',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            paddingLeft: '12px',
                                                        }}
                                                        title={calendar.calendarname}
                                                    >
                                                        {calendar.calendarname}
                                                    </h3>
                                                    <button
                                                        style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            padding: 0,
                                                            borderRadius: '50%',
                                                            background: '#fff',
                                                            border: '1.5px solid #d1d5db',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.15s, border 0.15s, box-shadow 0.15s',
                                                            marginLeft: '8px',
                                                        }}
                                                        onMouseOver={e => {
                                                            e.currentTarget.style.background = '#f3f4f6';
                                                            e.currentTarget.style.border = '1.5px solid #a3a3a3';
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                                                        }}
                                                        onMouseOut={e => {
                                                            e.currentTarget.style.background = '#fff';
                                                            e.currentTarget.style.border = '1.5px solid #d1d5db';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onClick={() => {
                                                            setChosenDate(new Date());
                                                            setShowCalendarID(calendar.calendarid);
                                                            setEventFormOpen(true);
                                                        }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                                            <rect x="6" y="2" width="2" height="10" rx="1" fill="#222" />
                                                            <rect x="2" y="6" width="10" height="2" rx="1" fill="#222" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <ScrollBlock
                                                    maxHeight='30%'
                                                    height='auto'
                                                    key={calendar.calendarid}
                                                    buttonData={
                                                        myEvents[calendar.calendarid] && myEvents[calendar.calendarid].length > 0
                                                            ? myEvents[calendar.calendarid].map((event) => ({
                                                                label: event.eventname + " - " + new Date(event.startdt).toLocaleString(),
                                                                onClick: () => {
                                                                    setShowEventID(event.eventid);
                                                                    setTimeout(() => {
                                                                        setShowEventOpen(true);
                                                                    }, 100);
                                                                },
                                                            }))
                                                            : [
                                                                {
                                                                    label: "No events",
                                                                    onClick: () => { },
                                                                },
                                                            ]
                                                    }
                                                >
                                                </ScrollBlock>
                                            </div>
                                        ))}

                                    </ScrollBlock>

                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Followed Events</h2>
                                    <ScrollBlock
                                        height='40%'>
                                        {followedCalendars.map((calendar) => (
                                            <div
                                                key={calendar.calendarid}
                                                style={{
                                                    marginBottom: '16px'
                                                }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        borderBottom: '2px solid black',
                                                        paddingBottom: '8px',
                                                        marginBottom: '16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            fontSize: '24px',
                                                            fontWeight: 'bold',
                                                            margin: 0,
                                                            flex: 1, // This makes the heading take all available space
                                                            lineHeight: 'normal',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            paddingLeft: '12px',
                                                        }}
                                                        title={calendar.calendarname}
                                                    >
                                                        {calendar.calendarname}
                                                    </h3>
                                                </div>
                                                <ScrollBlock
                                                    maxHeight='30%'
                                                    height='auto'
                                                    key={calendar.calendarid}
                                                    buttonData={
                                                        myEvents[calendar.calendarid] && myEvents[calendar.calendarid].length > 0
                                                            ? myEvents[calendar.calendarid].map((event) => ({
                                                                label: event.eventname + " - " + new Date(event.startdt).toLocaleString(),
                                                                onClick: () => {
                                                                    setShowEventID(event.eventid);
                                                                    setTimeout(() => {
                                                                        setShowEventOpen(true);
                                                                    }, 100);
                                                                },
                                                            }))
                                                            : [
                                                                {
                                                                    label: "No events",
                                                                    onClick: () => { },
                                                                },
                                                            ]
                                                    }
                                                >
                                                </ScrollBlock>
                                            </div>
                                        ))}

                                    </ScrollBlock>
                                </>
                        }
                    }
                />}
                mainContent={
                    <div className='calendar-wrapper'>
                        <div className='main-content-centered'>
                            <DropdownList
                                optionArray={monthOptionsArray} // Assigns the options to the month dropdown list
                                value={String(calendarDisplay.getMonth())} // Assigns the default value of the list to the current month
                                onChange={(event) => {handleOnMonthChange(event.target.value);}}
                            />
                            <DropdownList
                                optionArray={yearOptionsArray} // Assigns the options to the year dropdown list
                                value={String(calendarDisplay.getFullYear())} // Assigns the default value of the list to the current year
                                onChange={(event) => {handleOnYearChange(event.target.value);}}
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
                                setExtraEventsPopUp={setExtraEventsPopUp}
                                setExtraEvents={setExtraEvents}
                                setPopUpPosition={setPopUpPosition}
                                extraEvents={extraEvents}
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
                    eventid={showEventID}
                    setShowCalendarID={setShowCalendarID}
                    setShowCalendarOpen={setShowCalendarOpen}
                    setShowEventOpen={setShowEventOpen}
                >
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
                isHidden={!isCreateCalendarOpen}
                onClose={() => hideOverlayBackground()}
            >
                <CreateCalendar
                    accountid={currentUserAccountId}
                    onClose={() => {
                        setCreateCalendarOpen(false)
                        hideOverlayBackground()
                    }}
                    onSave={() => {
                        setCreateCalendarOpen(false)
                        setMainRefreshTrigger(mainRefreshTrigger + 1)
                        hideOverlayBackground()
                    }}
                >

                </CreateCalendar>
            </OverlayBlock>

            <OverlayBlock
                isHidden={isEventHidden} // Assigns isEventHidden function
                onClose={() => hideOverlayBackground()} // Assigns toggleEventHidden function
            >
                <button
                    onClick={() => setEventFormOpen(true)}
                    style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        background: 'white',
                        border: '1.5px solid #222',
                        borderRadius: '16px',
                        padding: '6px 14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        zIndex: 1002,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                    }}
                >+ Add Event</button>
                <div style={{ paddingBottom: '20px' }}>
                    <TimeTable chosenDate={chosenDate} refreshTrigger={eventRefreshTrigger} eventselector={setSelectedEvent} setEventDetailsOpen={setEventDetailsOpen}>
                    </TimeTable>
                </div>
            </OverlayBlock>

            {isEventDetailsOpen && selectedEvent && (
                <OverlayBlock onClose={() => setEventDetailsOpen(false)}>
                    <EventDisplay
                        displayedEvent={selectedEvent}
                        onClose={() => setEventDetailsOpen(false)}
                        onDelete={() => seteventRefreshTrigger(prev => prev + 1)} />
                </OverlayBlock>
            )}

            {/* ADD event overlay block */}
            {isEventFormOpen && (
                <OverlayBlock
                    isHidden={false}
                    onClose={() => setEventFormOpen(false)}>
                    <CreateEvent onClose={() => {
                        hideOverlayBackground()
                        setChosenDate(new Date())
                        setShowCalendarID('')
                    }}
                        onSave={() => {
                            hideOverlayBackground()
                            setChosenDate(new Date())
                            setShowCalendarID('')
                            setMainRefreshTrigger(prev => prev + 1)
                            seteventRefreshTrigger(prev => prev + 1);
                        }}
                        chosenDate={chosenDate}
                        accountid={currentUserAccountId}
                        calendarid={showCalendarID} />
                </OverlayBlock>
            )
            }

            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditAccountsFormOpen}>
                <EditAccountForm onClose={() => hideOverlayBackground()} />
            </OverlayBlock>

            {/* nic's edit accounts form */}
            <OverlayBlock
                isHidden={!isEditCalendarsFormOpen}>
                <EditCalendarsForm onClose={() => hideOverlayBackground()} currentAccountId={currentUserAccountId} />
            </OverlayBlock>
        </div >
    )
}

export default HomePage // Means that home.jsx only exports HomePage