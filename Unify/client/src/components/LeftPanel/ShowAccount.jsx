import React, { useEffect, useState } from "react";
import accountService from "../../services/accountService.jsx";
import calendarService from "../../services/calendarService.jsx";
import { ScrollBlock } from "../blocks/ScrollBlock.jsx";

export const ShowAccount = ({ accountid, setShowCalendarID, setShowCalendarOpen, setShowAccountOpen }) => {
    const [accountData, setAccountData] = useState(null);
    const [accountCalendars, setAccountCalendars] = useState([]);
    const [error, setError] = useState(null);

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

    if (error) return <div>{error}</div>;
    if (!accountData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Account Details</h2>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <tbody>
                    <tr>
                        <th>Account ID</th>
                        <td>{accountData.accountid}</td>
                    </tr>
                    <tr>
                        <th>Account Name</th>
                        <td>{accountData.accountusername}</td>
                    </tr>
                    <tr>
                        <th>Account Description</th>
                        <td>{accountData.accountdescription}</td>
                    </tr>
                    <tr>
                        <th>Account Privacy</th>
                        <td>{accountData.accountprivacy}</td>
                    </tr>
                    <tr>
                        <th>Account Calendars</th>
                        <td>
                            <ScrollBlock
                                buttonData={accountCalendars.map(calendar => ({
                                    label: calendar.calendarname,
                                    onClick: () => {

                                        setShowCalendarID(calendar.calendarid);
                                        // console.log("Selected Calendar ID:", calendar.calendarid);
                                        setTimeout(() => {
                                            setShowCalendarOpen(true);
                                            setShowAccountOpen(false);
                                        }
                                        , 100); 

                                    }
                                }))}
                            >
                            </ScrollBlock>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

}
