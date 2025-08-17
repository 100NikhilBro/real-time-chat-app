import axios from "axios";

// export const chatInstance = axios.create({
//     baseURL: "/api/v1/users/chats"
// })


const BASE_URL = "https://real-time-chat-app-wpf4.onrender.com/api/v1";

export const chatInstance = axios.create({
    baseURL: BASE_URL + "/users/chats",
    withCredentials: true
})



//  Interceptor to add token in header automatically -> yeh dhyan rakhna thodha sa 

chatInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("zapchat_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
