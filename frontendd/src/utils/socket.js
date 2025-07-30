import { io } from "socket.io-client";

const token = localStorage.getItem("zapchat_token");

const socket = io("http://localhost:6174", {
    auth: {
        token: token,
    },
    withCredentials: true,
});

export default socket;