import { io } from "socket.io-client";

const token = localStorage.getItem("zapchat_token");


const socket = io("https://real-time-chat-app-wpf4.onrender.com", {
  auth: {
    token: token,
  },
  withCredentials: true,
});

export default socket;
