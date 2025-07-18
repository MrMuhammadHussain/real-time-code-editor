import express from 'express';
import http from 'http';
import { Server } from "socket.io"
import Actions from './src/Actions.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("build"))
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.PORT || 5080
const server = http.createServer(app)
const io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
const usersList = {}

const getAllClints = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: usersList[socketId]
    }}
  )}

io.on("connection", (socket) => {
  // console.log("✅ client connected", socket.id);

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

  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Actions.CODE_CHANGE, { code })
  })

  socket.on(Actions.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(Actions.CODE_CHANGE, { code })
  })

  socket.on(Actions.TYPING, ({ username, roomId }) => {
    socket.in(roomId).emit(Actions.TYPING, { username })
  })

  socket.on(Actions.CODE_OUTPUT, ({ output, roomId }) => {
    io.to(roomId).emit(Actions.CODE_OUTPUT, { output })
  })

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: usersList[socket.id],
      })
    })
    delete usersList[socket.id]
    socket.leave()
  })
})

server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
})