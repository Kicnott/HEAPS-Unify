import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const showAllCalenders = () => {
    return http.get('/home/showAllCalenders')
}

const createCalender = (data) => {
    return http.post(`/home/createCalender`, data)
}

const deleteCalender = (data) => {
    return http.delete(`/home/deleteCalender`, {data})
}

export default {
    showAllCalenders,
    createCalender,
    deleteCalender
}