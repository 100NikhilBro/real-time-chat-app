import { io } from "socket.io-client";

const token = localStorage.getItem("zapchat_token");


const socket = io("https://real-time-chat-app-wpf4.onrender.com", {
  auth: {
    token: token,
  },
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

export default socket;
