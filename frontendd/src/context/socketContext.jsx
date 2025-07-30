import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("zapchat_token");

    if (token) {
      const newSocket = io("http://localhost:6174", {
        auth: { token },
        withCredentials: true,
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
