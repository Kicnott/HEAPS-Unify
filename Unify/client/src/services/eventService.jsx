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

const updateEvent = (data) => {
    return http.put('/home/updateEvent', data)
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

const deleteEvent = (eventid) => {
    return http.delete(`/home/deleteEvent/${eventid}`);
}

// add delete and modify routes

export default {
    createEvent,
    getEvents,
    getMyEvents,
    getEvent,
    updateEvent,
    deleteEvent
}
