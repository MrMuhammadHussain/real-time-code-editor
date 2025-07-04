import { io } from "socket.io-client";


export const initSoket = async () => {
        const options = {
            "force new connection": true,
            reconnectionAttempts: "infinity",
            reconnectionDelay: 1000,
            transports: ['websocket'],
        }
    return io(process.env.REACT_APP_BACKEND_URL, options);
}




// import { io } from "socket.io-client";

// let socket = null;

// export const initSoket = () => {
//   if (!socket) {
//     socket = io(process.env.REACT_APP_BACKEND_URL, {
//       transports: ['websocket'],
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//     });
//   }
//   return socket;
// };
