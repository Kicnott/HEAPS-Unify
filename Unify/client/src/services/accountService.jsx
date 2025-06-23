import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8888",
    headers: {
        "Content-Type": "application/json",
    },
})

const showAllAccounts = () => {
    return http.get('/home')
}

const createAccount = (data) => {
    return http.put(`/home/${id}`, data)
}

const deleteAccount = (id) => {
    return http.delete(`/home/${id}`)
}

export default {
    showAllAccounts,
    createAccount,
    deleteAccount
}