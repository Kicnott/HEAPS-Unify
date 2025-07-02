import { useState, useEffect } from 'react'
import calendarService from '../../services/calendarService.jsx'
import eventService from '../../services/eventService.jsx'
import accountService from '../../services/accountService.jsx'

export async function getMyCalendars(accountid) {
    const res = await calendarService.getMyCalendars(accountid)
    // const sorted = res.data.rows.sort((a, b) => a.calendarid - b.calendarid)
    // console.log(res.data.rows)
    return res.data.rows
}

export async function getMyEvents(accountid) {
    const calendarData = await getMyCalendars(accountid);
    const calendarids = calendarData.map(calendar => calendar.calendarid);

    const events = {};

    for (const calendarid of calendarids) {
        const res = await eventService.getMyEvents(calendarid);
        events[calendarid] = res.data.rows;
    }
    return events;
}

export async function getAllAccounts() {
    const res = await accountService.showAllAccounts()
    return res.data.rows
}
