import { io } from "socket.io-client";


export const initSoket = async () => {
    const options = {
        "force new connection": true,
        reconnectionAttempts: "infinity",
        reconnectionDelay: 1000,
        transports: ['websocket'],
    }
    const URL =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_BACKEND_URL
            : "/";

    return io(URL, options);

    // return io("/" || process.env.REACT_APP_BACKEND_URL, options);
}