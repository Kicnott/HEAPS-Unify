import axios from "axios";

const http = axios.create({
    baseURL: "https://heaps-unify-1.onrender.com/",
    headers: {
        "Content-Type": "application/json",
    },
})

const getMonthEvents = (data) => {
    return http.get('/home/getMonthEvents', {params : data})
}

export default {
    getMonthEvents,
}