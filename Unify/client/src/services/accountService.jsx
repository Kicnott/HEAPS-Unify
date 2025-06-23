import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const showAllAccounts = () => {
    return http.get('/home/showAllAccounts')
}

const createAccount = (data) => {
    return http.post(`/home/createAccount`, data)
}

const deleteAccount = (data) => {
    return http.delete(`/home/deleteAccount`, {data})
}

export default {
    showAllAccounts,
    createAccount,
    deleteAccount
}