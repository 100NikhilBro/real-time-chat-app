import axios from "axios"

// const userInstannce = axios.create({
//     baseURL: "/api/v1/users"
// })



const BASE_URL = "https://real-time-chat-app-wpf4.onrender.com";

const userInstannce = axios.create({
    baseURL: BASE_URL + "/users",
    withCredentials: true
})



//Automatically attach token to every request
userInstannce.interceptors.request.use((config) => {
    const token = localStorage.getItem("zapchat_token") // token store kiya tha after login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default userInstannce
