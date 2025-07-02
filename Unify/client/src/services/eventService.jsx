import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const createEvent = (data) => {
    return http.post('/home/createEvent', data)
}

const getEvents = () => {
    return http.get('/home/showAllEvents')
}

const getMyEvents = (calendarid) => {
    return http.get('/home/getMyEvents', {
        params: {
            calendarid: calendarid
        }
    })
}

const getEvent = (eventid) => {
    return http.get('/home/getEvent', {params: { eventid: eventid }})
}

export default {
    createEvent,
    getEvents,
    getMyEvents,
    getEvent
}