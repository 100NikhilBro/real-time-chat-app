import axios from "axios";


export const messageInstance = axios.create({
    baseURL: "/api/v1/users/chats/messages",
});


// Interceptor to add token in header automatically
messageInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("zapchat_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});