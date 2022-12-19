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
  // Lytter på alle meldinger som kommer til "mainRoomToSend"
  socket.on("mainRoomToSend", (msg, room) => {
    console.log(`Message: ${msg}`);
    console.log(`Room: ${room}`);
    // Om "room" ikke er med i meldingen fra klinet, send melding til alle som lytter på mainRoomToSend
    if (room == null) {
      // socket.broadcast.emit sender ikke melding tilbake til den som sendte meldingen først
      socket.broadcast.emit("mainRoomToReceive", msg);
      console.log("Melding sendt i mainRoomToSend");
      // om melding inneholder en room så send melding til kun det roomet
    } else {
      socket.to(room).emit("mainRoomToReceive", msg, room);
      console.log(`Melding sendt i ${room}`);
    }
  });

  // Legger til en bruker i ønsket room
  socket.on("Room-Joined", (room, id) => {
    socket.join(room);
    console.log(`${id} joined ${room}`);
    // console.log(socket.rooms);
  });

  // Fjerner bruker fra ønsket room
  socket.on("Leave-Room", (room, id) => {
    socket.leave(room);
    console.log(`${id} disconnected from: ${room}`);
    // console.log(socket.rooms);
  });

  // Sender info til bruker om hvilket rooms den er i
  socket.on("get-rooms", (showMsg) => {
    let arrayOfRooms = [];
    const getRoomForUser = socket.rooms;
    for (const entry of getRoomForUser) {
      arrayOfRooms.push(entry);
    }
    console.log(arrayOfRooms);
    socket.emit("get-rooms-user", arrayOfRooms, showMsg);
    console.log(showMsg);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
