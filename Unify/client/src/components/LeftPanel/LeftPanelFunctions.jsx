import { useState, useEffect} from 'react'
import calendarService from '../../services/calendarService.jsx'
import eventService from '../../services/eventService.jsx'
import accountService from '../../services/accountService.jsx'

export async function getMyCalendars(accountid){
const res = await calendarService.getMyCalendars(accountid)    
// const sorted = res.data.rows.sort((a, b) => a.calendarid - b.calendarid)
    // console.log(res.data.rows)
    return res.data.rows
}

export async function getMyEvents(calendarid){
    const res = await eventService.getMyEvents(calendarid)
    return res.data.rows
}

export async function getAllAccounts(){
    const res = await accountService.showAllAccounts()
    return res.data.rows
}
