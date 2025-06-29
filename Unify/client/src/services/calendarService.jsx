import axios from "axios";

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

const getMyCalendars = (data) => {
    return http.get('/home/getMyCalendars', {data})
}

export default {
    showAllCalendars,
    createCalendar,
    deleteCalendar,
    getMyCalendars
}