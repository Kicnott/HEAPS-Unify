import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import { monthOptionsArray, yearOptionsArray } from '../constants/calendarConstants.jsx'
// import getBaseDate from '../functions/getBaseDate.jsx'
import { uAccount, uCalendar, uCalendarDisplay, uEvent, uTimeslot } from '../classes/'
import profilePlaceholder from '../assets/placeholder_pfp.jpg';

// Components
import { TopNavbar } from "../components/blocks/TopNavbar.jsx"
import { RightDrawer } from "../components/rightDrawer/RightDrawer.jsx"
import { MainCalendar } from '../components/monthCalendar/MainCalendar.jsx'
import { OverlayBlock } from '../components/blocks/OverlayBlock.jsx'
import { DropdownList } from '../components/monthCalendar/DropdownList.jsx'
import { TimeTable } from '../components/dayCalender/timeTable.jsx'
import { CreateEvent } from '../components/dayCalender/CreateNewEvent.jsx'
import { EditAccountForm } from '../components/rightDrawer/EditAccounts.jsx'
import { EditCalendarsForm } from '../components/monthCalendar/EditCalendars.jsx'
import { OverlayBackground } from '../components/overlay/OverlayBackground.jsx'
import { LeftTabPanel } from '../components/LeftPanel/LeftTabPanel.jsx'
import { ScrollBlock } from '../components/blocks/ScrollBlock.jsx'
import MainLayout from '../components/blocks/MainLayout.jsx'
import { getMyCalendars, getFollowedEvents, getMyEvents, getAllAccounts, getFollowedCalendars, getMyDisplayedCalendars, searchAccounts } from '../components/LeftPanel/LeftPanelFunctions.jsx'
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
import accountService from '../services/accountService.jsx'
import { ColorCircle } from '../components/blocks/ColorPopover.jsx'
import { ModifyCalendar } from '../components/LeftPanel/ModifyCalendar.jsx'
import { ModifyEvent } from '../components/LeftPanel/ModifyEvent.jsx'


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

    const [isCreateCalendarOpen, setCreateCalendarOpen] = useState(false)
    const [mainRefreshTrigger, setMainRefreshTrigger] = useState(0)

    const [myDisplayedCalendarIds, setMyDisplayedCalendarIds] = useState([])

    const [isExtraEventsPopUpOpen, setExtraEventsPopUp] = useState(false);

    const [refreshMonthEvents, setRefreshMonthEvents] = useState(0)
    const [monthEvents, setMonthEvents] = useState([])

    const [isModifyCalendarOpen, setModifyCalendarOpen] = useState(false)
    const [isModifyEventOpen, setModifyEventOpen] = useState(false)

    const [extraEvents, setExtraEvents] = useState([]);
    const [popUpPosition, setPopUpPosition] = useState({ x: 0, y: 0 });

    const [isOverlayBackgroundHidden, setOverlayBackgroundHidden] = useState(true);
    // const isOverlayBackgroundHidden = isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen && !isShowCalendarOpen && !isShowAccountsOpen && !isShowEventOpen;

    const [isExtraOverlayBackgroundHidden, setExtraOverlayBackgroundHidden] = useState(true);

    const [myCalendars, setMyCalendars] = useState([]);
    const [followedCalendars, setFollowedCalendars] = useState([])
    const [allAccounts, setAllAccounts] = useState([])
    const [myEvents, setMyEvents] = useState([]);
    const [followedEvents, setFollowedEvents] = useState([])
    const [searchAccountTerm, setSearchAccountTerm] = useState('')
    const [searchedAccounts, setSearchedAccounts] = useState([])

    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    }

    const debouncedSearchTerm = useDebounce(searchAccountTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            searchAccounts(debouncedSearchTerm).then((accounts) => {
                setSearchedAccounts(accounts);
            });
        } else {
            setSearchedAccounts([]);
        }
    }, [debouncedSearchTerm]);


    useEffect(() => {

        if (currentUserAccountId) {
            getMyCalendars(currentUserAccountId).then((calendars) => {
                setMyCalendars(calendars);
            });

            getAllAccounts(currentUserAccountId).then((accounts) => {
                setAllAccounts(accounts);
            });

            getFollowedCalendars(currentUserAccountId).then((calendars) => {
                const sortedCalendars = calendars.sort((a, b) => a.calendarid - b.calendarid);
                setFollowedCalendars(sortedCalendars);
            });

            getFollowedEvents(currentUserAccountId).then(setFollowedEvents)

            getMyEvents(currentUserAccountId).then(setMyEvents);

            getMyDisplayedCalendars(currentUserAccountId).then(setMyDisplayedCalendarIds)

        }
    }, [currentUserAccountId, mainRefreshTrigger]);

    useEffect(() => {
        if (debouncedSearchTerm != "") {
            searchAccounts(debouncedSearchTerm).then((accounts) => {
                setSearchedAccounts(accounts)
            })
        }
        else {
            setSearchedAccounts([])
        }

    }, [debouncedSearchTerm])

    useEffect(() => {
        console.log(searchedAccounts)
    }, [searchedAccounts])

    // hides background when overlay is hidden
    useEffect(() => {
        setOverlayBackgroundHidden(() => {
            return isEventHidden && !isRightDrawerOpen && !isEventFormOpen && !isEditCalendarsFormOpen && !isEditAccountsFormOpen && !isShowCalendarOpen && !isShowAccountsOpen && !isShowEventOpen && !isCreateCalendarOpen && !isEventDetailsOpen && !isModifyCalendarOpen && !isModifyEventOpen;
        });
        setExtraOverlayBackgroundHidden(() => {
            return !isExtraEventsPopUpOpen;
        });

    }, [isEventHidden, isExtraEventsPopUpOpen, isRightDrawerOpen, isEventFormOpen, isEditCalendarsFormOpen, isEditAccountsFormOpen, isShowCalendarOpen, isShowAccountsOpen, isShowEventOpen, isCreateCalendarOpen, isEventDetailsOpen, isModifyCalendarOpen, isModifyEventOpen]);


    // console.log("Displayed Calendar IDs: ", myDisplayedCalendarIds)
    // console.log("Followed Calendars: ", followedCalendars);
    // console.log("My Events: ", myEvents);
    // console.log("My Calendars: ", myCalendars);
    // console.log("All Accounts: ", allAccounts);

    // console.log("Chosen Date: ", chosenDate);

    useEffect(() => { // refreshes month events; display updated events on month calender
        const fetchMonthEvents = async () => {
            try {
                // Check if sessionStorage already has values
                const existingMonth = sessionStorage.getItem("currMonth");
                const existingYear = sessionStorage.getItem("currYear");

                if (!existingMonth || !existingYear) {
                    const currMonth = calendarDisplay.getMonth();
                    const currYear = calendarDisplay.getFullYear();
                    sessionStorage.setItem("currMonth", currMonth.toString());
                    sessionStorage.setItem("currYear", currYear.toString());
                }

                const sessionCurrMonth = sessionStorage.getItem("currMonth");
                const monthEvents = await monthEventsService.getMonthEvents({ currMonth: sessionCurrMonth });
                setMonthEvents(monthEvents.data);

            } catch (err) {
                console.error("Error fetching month events: ", err);
            }
        }
        fetchMonthEvents();
    }, [refreshMonthEvents])

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
        setModifyCalendarOpen(false)
        setModifyEventOpen(false)
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
        setModifyCalendarOpen(false)
        setModifyEventOpen(false)
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

    function formatFollowerCount(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
        if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    }

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
                                        height='40%'
                                        buttonData={myCalendars.map((calendar) => ({
                                            label: (
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            flex: 1,
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {calendar.calendarname}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#a3a3a3',
                                                            marginLeft: '12px',
                                                            fontSize: '0.95em',
                                                            flexShrink: 0,
                                                        }}
                                                        title={calendar.followercount + ' follower' + (calendar.followercount == 1 ? '' : 's')}
                                                    >
                                                        👥 {formatFollowerCount(calendar.followercount)}
                                                    </span>
                                                </span>
                                            ),
                                            id: calendar.calendarid,
                                            color: calendar.calendarcolour,
                                            title: calendar.calendarname,
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
                                    <ScrollBlock height='40%'
                                        buttonData={followedCalendars.map((calendar) => ({
                                            label: (
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginRight: 8
                                                        }}
                                                    >
                                                        <ColorCircle
                                                            color={calendar.calendarcolour}
                                                        />
                                                    </span>
                                                    <span
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            flex: 1,
                                                            minWidth: 0,
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        {calendar.calendarname}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#a3a3a3',
                                                            marginLeft: '12px',
                                                            fontSize: '0.95em',
                                                            flexShrink: 0,
                                                        }}
                                                        title={calendar.followercount + ' follower' + (calendar.followercount == 1 ? '' : 's')}
                                                    >
                                                        👥 {formatFollowerCount(calendar.followercount)}
                                                    </span>
                                                </span>
                                            ),
                                            id: calendar.calendarid,
                                            color: calendar.calendarcolour,
                                            title: calendar.calendarname,
                                            onClick: () => {
                                                setShowCalendarID(calendar.calendarid)
                                                setTimeout(() => {
                                                    setShowCalendarOpen(true)
                                                }, 100)
                                            }
                                        }))}
                                        checkboxButton={true}
                                        // gotColour={true}
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


                                    buttonData={(searchAccountTerm ? searchedAccounts : allAccounts).map((account) => ({
                                        label: (
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <img
                                                    src={profilePlaceholder}
                                                    alt={account.accountusername + " profile"}
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        marginRight: 10,
                                                        flexShrink: 0,
                                                        background: '#e5e7eb',
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        flex: 1,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    {account.accountusername}
                                                </span>
                                                <span
                                                    style={{
                                                        color: '#a3a3a3',
                                                        marginLeft: '12px',
                                                        fontSize: '0.95em',
                                                        flexShrink: 0,
                                                    }}
                                                    title={
                                                        account.followercount +
                                                        ' follower' +
                                                        (account.followercount === 1 ? '' : 's')
                                                    }
                                                >
                                                    👥 {formatFollowerCount(account.followercount)}
                                                </span>
                                            </span>
                                        ),
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
                                    <div style={{ position: 'relative', width: '80%', maxWidth: '100%', marginBottom: '20px' }}>
                                        <input
                                            type="text"
                                            placeholder="Find an account..."
                                            style={{
                                                width: '100%',
                                                padding: '10px 40px 10px 14px',
                                                borderRadius: '24px',
                                                border: '1.5px solid #d1d5db',
                                                fontSize: '16px',
                                                outline: 'none',
                                                background: '#fafbfc',
                                                color: '#222',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                                transition: 'border 0.2s, box-shadow 0.2s',
                                            }}
                                            value={searchAccountTerm}
                                            onChange={(e) => setSearchAccountTerm(e.target.value)}
                                        />
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            style={{
                                                position: 'absolute',
                                                right: '-35px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#a3a3a3',
                                                cursor: 'pointer',
                                                pointerEvents: 'auto',
                                            }}
                                            aria-hidden="true"
                                            onClick={() => {

                                            }}
                                        >
                                            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                                            <line x1="15" y1="15" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    {!searchAccountTerm && (
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
                                            Suggested Accounts
                                        </h3>

                                    )}

                                    {searchAccountTerm && searchedAccounts.length >= 1 && (
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
                                            Results
                                        </h3>

                                    )}

                                    {searchAccountTerm && searchedAccounts.length == 0 && (
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
                                            No Result Found
                                        </h3>

                                    )}



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
                                                            flex: 1,
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
                                                            flex: 1,
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
                                                        followedEvents[calendar.calendarid] && followedEvents[calendar.calendarid].length > 0
                                                            ? followedEvents[calendar.calendarid].map((event) => ({
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
                                value={calendarDisplay.getMonth()} // Assigns the default value of the list to the current month
                                onChange={(event) => {
                                    sessionStorage.setItem("currentMonth", Number(event.target.value))
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
                                isOverlayBackgroundHidden={isOverlayBackgroundHidden}
                                hideOverlayBackground={hideOverlayBackground}
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
                    onModifyEventClick={() => {
                      hideOverlayBackground()
                        setModifyEventOpen(true)
                    }}
                    setShowCalendarID={setShowCalendarID}
                    setShowCalendarOpen={setShowCalendarOpen}
                    setShowEventOpen={setShowEventOpen}
                    currentAccountid={currentUserAccountId}
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
                    modifyCalendarOnClick={(e) => {
                        hideOverlayBackground()
                        setModifyCalendarOpen(true)
                    }}
                    refreshTrigger={setMainRefreshTrigger}>
                </ShowCalendar>
            </OverlayBlock>

            <OverlayBlock
                isHidden={!isShowAccountsOpen}
                onClose={() => hideOverlayBackground()}>
                <ShowAccount
                    accountid={showAccountID}
                    currentAccountid={currentUserAccountId}
                    setShowCalendarID={setShowCalendarID}
                    setShowCalendarOpen={setShowCalendarOpen}
                    setShowAccountOpen={setShowAccountsOpen}
                    refreshTrigger={setMainRefreshTrigger}
                >
                </ShowAccount>
            </OverlayBlock>

            <OverlayBlock
                isHidden={!isModifyCalendarOpen}
                onClose={() => hideOverlayBackground()}>
                <ModifyCalendar
                    accountid={currentUserAccountId}
                    calendarid={showCalendarID}
                    onClose={() => {
                        setCreateCalendarOpen(false)
                        setMainRefreshTrigger(mainRefreshTrigger + 1)
                        hideOverlayBackground()
                    }}
                    onSave={() => {
                        setCreateCalendarOpen(false)
                        setMainRefreshTrigger(mainRefreshTrigger + 1)
                        hideOverlayBackground()
                    }}
                >
                </ModifyCalendar>
            </OverlayBlock>

            <OverlayBlock
                isHidden={!isModifyEventOpen}
                onClose={() => hideOverlayBackground()}>
                <ModifyEvent
                    accountid={currentUserAccountId}
                    eventid={showEventID}
                    onClose={() => {
                        setModifyEventOpen(false)
                        setMainRefreshTrigger(mainRefreshTrigger + 1)
                        hideOverlayBackground()
                    }}
                    onSave={() => {
                        setModifyEventOpen(false)
                        setMainRefreshTrigger(mainRefreshTrigger + 1)
                        hideOverlayBackground()
                    }}
                >
                </ModifyEvent>
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
                    < TimeTable chosenDate={chosenDate} refreshTrigger={eventRefreshTrigger} eventselector={setShowEventID} setEventDetailsOpen={setShowEventOpen} closeOthers={hideOverlayBackground}>
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