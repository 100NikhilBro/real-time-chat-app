import axios from "axios";


// export const messageInstance = axios.create({
//     baseURL: "/api/v1/users/chats/messages",
// });


const BASE_URL = "https://real-time-chat-app-wpf4.onrender.com/api/v1";

export const messageInstance = axios.create({
    baseURL: BASE_URL + "/users/chats/messages",
    withCredentials: true
});


// Interceptor to add token in header automatically
messageInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("zapchat_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
