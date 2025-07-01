import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const getMonthEvents = (data) => {
    return http.get('/home/getMonthEvents', data)
}

export default {
    getMonthEvents,
}