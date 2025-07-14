import React, { useEffect, useState } from "react";
import accountService from "../../services/accountService.jsx";
import calendarService from "../../services/calendarService.jsx";
import { ScrollBlock } from "../blocks/ScrollBlock.jsx";
import profilePlaceholder from '../../assets/placeholder_pfp.jpg';
import { ColorCircle } from "../blocks/ColorPopover.jsx";

function formatFollowerCount(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

async function checkIsFollowing(calendarid, currentAccountid) {
    const res = calendarService.checkFollowedCalendar(calendarid, currentAccountid)

    return (await res).data.status
}


export const ShowAccount = ({ currentAccountid, accountid, setShowCalendarID, setShowCalendarOpen, setShowAccountOpen, refreshTrigger }) => {
    const [accountData, setAccountData] = useState(null);
    const [accountCalendars, setAccountCalendars] = useState([]);
    const [error, setError] = useState(null);
    const [followStates, setFollowStates] = useState({});

    useEffect(() => {
        async function fetchFollowStates() {
            const states = {};
            for (const calendar of accountCalendars) {
                states[calendar.calendarid] = await checkIsFollowing(calendar.calendarid, currentAccountid);
            }
            setFollowStates(states);
        }
        fetchFollowStates();
    }, [accountCalendars, currentAccountid]);

    useEffect(() => {
        if (accountid) {
            accountService.getAccount(accountid)
                .then(res => setAccountData(res.data))
                .catch(err => setError("Account not found or error loading account."));
        }
    }, [accountid]);

    useEffect(() => {
        if (accountid) {
            calendarService.getMyCalendars(accountid)
                .then(res => setAccountCalendars(res.data.rows))
                .catch(err => setError("Error loading calendars for this account."));
        }
    }, [accountid]);

    useEffect(() => {
        return () => setError(null);
    }, [accountid]);

    if (error) return <div>{error}</div>;
    if (!accountData) return <div>Loading...</div>;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 32,
                    borderBottom: '2px solid #222',
                    paddingBottom: 16,
                }}
            >
                <img
                    src={accountData.profilePicUrl || profilePlaceholder}
                    alt={`${accountData.accountusername} profile`}
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: 24,
                        border: '3px solid #eee',
                        background: '#f3f4f6'
                    }}
                />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}>
                    <div style={{
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        marginBottom: 6,
                        lineHeight: 1.2
                    }}>
                        {accountData.accountusername}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 18,
                        fontSize: 15,
                        color: '#888',
                        fontWeight: 500
                    }}>
                        <span>
                            👥 {formatFollowerCount(accountData.followercount)} follower{accountData.followercount === 1 ? '' : 's'}
                        </span>
                        <span>
                            📅 {formatFollowerCount(accountCalendars.length)} calendar{accountCalendars.length === 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: 500,
                margin: "2rem auto",
                background: "#fff",
                paddingLeft: 24,
                paddingRight: 24,
            }}>

                {accountData.accountdescription && (
                    <div style={{
                        background: "#f9fafb",
                        borderRadius: 8,
                        padding: "12px 18px",
                        marginBottom: 20,
                        fontSize: 16,
                        fontStyle: "italic"
                    }}>
                        {accountData.accountdescription}
                    </div>
                )}



                <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>
                        {accountData.accountusername}'s Calendars
                    </div>
                    {accountCalendars.length === 0 ? (
                        <ScrollBlock>
                            <div style={{ color: "#888" }}>No calendars</div>
                        </ScrollBlock>

                    ) : (
                        <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                            <ScrollBlock
                                buttonData={accountCalendars .filter(calendar => calendar.privacy !== 'private').map(calendar => (
                                    {
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
                                                    <ColorCircle color={calendar.calendarcolour} />
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
                                                {(accountid != currentAccountid) && (<button
                                                    key={calendar.calendarid}
                                                    style={{
                                                        marginLeft: 16,
                                                        padding: '4px 14px',
                                                        borderRadius: 16,
                                                        border: 'none',
                                                        background: followStates[calendar.calendarid] ? calendar.calendarcolour : '#A78E72',
                                                        color: followStates[calendar.calendarid] ? '#fff' : '#fff',
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s, color 0.2s',
                                                        outline: 'none',
                                                        boxShadow: followStates[calendar.calendarid] ? 'none' : '0 2px 8px rgba(99,102,241,0.07)',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (followStates[calendar.calendarid]) {
                                                            calendarService.unfollowCalendar(calendar.calendarid, currentAccountid)
                                                                .then(() => {
                                                                    setFollowStates(prev => ({
                                                                        ...prev,
                                                                        [calendar.calendarid]: false
                                                                    }));
                                                                    setTimeout(() => {
                                                                        if (refreshTrigger) { refreshTrigger(prev => (prev + 1)) };
                                                                    }, 100);

                                                                })
                                                                .catch(err => setError("Error unfollowing calendar."));
                                                        }
                                                        else {
                                                            calendarService.followCalendar(calendar.calendarid, currentAccountid)
                                                                .then(() => {
                                                                    setFollowStates(prev => ({
                                                                        ...prev,
                                                                        [calendar.calendarid]: true
                                                                    }));
                                                                    setTimeout(() => {
                                                                        if (refreshTrigger) { refreshTrigger(prev => (prev + 1)) };
                                                                    }, 100);

                                                                })
                                                                .catch(err => setError("Error following calendar."));
                                                        }
                                                    }}
                                                    aria-label={followStates[calendar.calendarid] ? "Unfollow calendar" : "Follow calendar"}
                                                    title={followStates[calendar.calendarid] ? "Unfollow" : "Follow"}
                                                >
                                                    {followStates[calendar.calendarid] ? 'Unfollow' : 'Follow'}
                                                </button>)
                                                }

                                                {(accountid == currentAccountid) && (
                                                    <button
                                                        key={calendar.calendarid}
                                                        style={{
                                                            marginLeft: 16,
                                                            padding: '4px 14px',
                                                            borderRadius: 16,
                                                            border: 'none',
                                                            background: calendar.calendarcolour,
                                                            color: '#fff',
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            cursor: 'pointer',
                                                            transition: 'background 0.2s, color 0.2s',
                                                            outline: 'none',
                                                            boxShadow: followStates[calendar.calendarid] ? 'none' : '0 2px 8px rgba(99,102,241,0.07)',
                                                        }}
                                                        onClick={() => { }}
                                                        title={"Modify " + calendar.calendarname}
                                                    >
                                                        Modify
                                                    </button>
                                                )}

                                            </span>
                                        ),
                                        onClick: () => {
                                            setShowCalendarID(calendar.calendarid);
                                            setTimeout(() => {
                                                setShowCalendarOpen(true);
                                                setShowAccountOpen(false);
                                            }, 100);
                                        }
                                    }))}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div >
    );


}
