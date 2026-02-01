import express from "express";
import http from "http";
import { Server } from "socket.io";
import { operations, addOperation, undo, redo } from "./state-manager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.emit("init", operations);

  socket.on("stroke:start", (stroke) => {
    addOperation({ type: "stroke", stroke });
    socket.broadcast.emit("stroke:start", stroke);
  });

  socket.on("stroke:update", (data) => {
    socket.broadcast.emit("stroke:update", data);
  });

  socket.on("stroke:end", (id) => {
    socket.broadcast.emit("stroke:end", id);
  });

  socket.on("undo", () => {
  const undoneOp = undo();
  if (!undoneOp){
     return;
  } 

  io.emit("undo-applied", undoneOp);
});

socket.on("redo", () => {
  const redoneOp = redo();

  if (!redoneOp){
      return;
  } 

  io.emit("redo-applied", redoneOp);
});




});

server.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
