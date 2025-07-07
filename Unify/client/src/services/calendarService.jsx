import axios from "axios";
import { CalendarDateBox } from "../components/monthCalendar/CalendarDateBox";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const showAllCalendars = () => {
    return http.get('/home/showAllCalendars')
}

const createCalendar = (data) => {
    return http.post(`/home/createCalendar`, data)
}

const deleteCalendar = (data) => {
    return http.delete(`/home/deleteCalendar`, {data})
}

const getMyCalendars = (accountid) => {
    return http.get('/home/getMyCalendars', { params: { accountid: accountid } })
}

const getCalendar = (calendarid) => {
    return http.get('/home/getCalendar', { params: { calendarid: calendarid } })
}

const followCalendar = (calendarid, accountid) => {
    return http.post('/home/followCalendar', { calendarid, accountid });
}

const checkFollowedCalendar = (calendarid, accountid) => {
    return http.get('/home/checkFollowedCalendar', { params: { calendarid, accountid } })
}

const getFollowedCalendars = (accountid) => {
    return http.get('/home/getFollowedCalendars', { params: { accountid: accountid } })
}

const unfollowCalendar = (calendarid, accountid) => {
    return http.delete('/home/unfollowCalendar', { data: { calendarid, accountid } })
}

const getMyDisplayedCalendars = (accountid) => {
    return http.get('/home/getMyDisplayedCalendars', { params: { accountid: accountid } })
}

const checkDisplayedCalendar = (calendarid, accountid) => {
    return http.get('/home/checkDisplayedCalendar', { params: { calendarid, accountid } })
}

const displayCalendar = (calendarid, accountid) => {
    return http.post('/home/displayCalendar', { calendarid, accountid });
}

const undisplayCalendar = (calendarid, accountid) => {
    return http.delete('/home/unDisplayCalendar', { data: { calendarid, accountid } })
}

export default {
    showAllCalendars,
    createCalendar,
    deleteCalendar,
    getMyCalendars,
    getCalendar,
    followCalendar,
    checkFollowedCalendar,
    getFollowedCalendars,
    unfollowCalendar,
    getMyDisplayedCalendars,
    checkDisplayedCalendar,
    displayCalendar,
    undisplayCalendar
}