import express from 'express';
import http from 'http';
import { Server } from "socket.io"
import cors from 'cors';
import Actions from './src/Actions.js';

const app = express()
app.use(express.json())

const port = process.env.PORT || 5080
const server = http.createServer(app)
const io = new Server(server)
const usersList = {}

const getAllClints = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: usersList[socketId]
    }
  }
  )
}

io.on("connection", (socket) => {
  console.log("✅ client connected", socket.id);

  socket.on(Actions.JOIN, ({ roomId, username }) => {
    usersList[socket.id] = username;
    socket.join(roomId)
    const clients = getAllClints(roomId)
    // console.log("👥 All clients in room:", roomId, clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.JOINED, {
        clients,
        username,
        socketId: socket.id

      })
    })
  })

})


server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
})