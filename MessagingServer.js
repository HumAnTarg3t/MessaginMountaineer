const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Public/MessaginClient.html");
});

io.on("connection", (socket) => {
  socket.on("main Chat", (msg, room) => {
    console.log(msg);
    console.log(room);
    if (room == null) {
      io.emit("main Chat", msg);
      console.log("123");
    } else {
      socket.to(room).emit("main Chat", msg);
      console.log("12qweqwe3");
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
