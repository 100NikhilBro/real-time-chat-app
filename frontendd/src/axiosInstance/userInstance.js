import axios from "axios"

const userInstannce = axios.create({
    baseURL: "/api/v1/users"
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