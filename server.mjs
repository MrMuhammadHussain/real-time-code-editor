import express from 'express';
import http from 'http';
import { Server } from "socket.io"
import cors from 'cors';

const app = express()
app.use(express.json())

const port = process.env.PORT || 5080
const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => {
console.log("✅ client connected", socket.id);

})


server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
})