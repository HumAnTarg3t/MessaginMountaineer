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
  // Lytter på alle meldinger som kommer til "main Chat"
  socket.on("main Chat", (msg, room) => {
    console.log(`Message: ${msg}`);
    console.log(`Room: ${room}`);
    // Om "room" ikke er med i meldingen fra klinet, send melding til alle som lytter på mainchat
    if (room == null) {
      // socket.broadcast.emit sender ikke melding tilbake til den som sendte meldingen først
      socket.broadcast.emit("main Chat", msg);
      console.log("Melding sendt i Main Chat");
      // om melding inneholder en room så send melding til kun det roomet
    } else {
      socket.to(room).emit("main Chat", msg, room);
      console.log(`Melding sendt i ${room}`);
    }
  });
  socket.on("Room-Joined", (room, id) => {
    socket.join(room);
    console.log(`${id} joined ${room}`);
    // console.log(socket.rooms);
  });

  socket.on("Leave-Room", (room, id) => {
    socket.leave(room);
    console.log(`${id} disconnected from: ${room}`);
    // console.log(socket.rooms);
  });

  socket.on("get-rooms", () => {
    let arrayOfRooms = [];
    const getRoomForUser = socket.rooms;
    for (const entry of getRoomForUser) {
      arrayOfRooms.push(entry);
    }
    console.log(arrayOfRooms);
    socket.emit("get-rooms-user", arrayOfRooms);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
