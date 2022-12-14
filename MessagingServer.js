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
      socket.broadcast.emit("main Chat", msg);
      console.log("Melding sendt i Main Chat");
    } else {
      socket.to(room).emit("main Chat", msg);
      console.log(`Melding sendt i ${room}`);
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
