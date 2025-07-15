import axios from "axios";

const http = axios.create({
    baseURL: "https://heaps-unify-1.onrender.com/",
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

const getAccount = (accountid) => {
    return http.get('/home/getAccount', { params: { accountid: accountid } });
}

const searchAccounts = (search) => {
    return http.get('/home/searchAccounts', { params: { search: search} })
}

export default {
    showAllAccounts,
    createAccount,
    deleteAccount,
    getAccount,
    searchAccounts
}