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

export default {
    createEvent,
}