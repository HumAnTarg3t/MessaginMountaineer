const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Public/MessaginClient.html");
});
let usersWithMoreThen2Rooms = [];

const addUserToExcept = (userToAdd) => {
  usersWithMoreThen2Rooms.push(userToAdd);
  console.log(`User ${userToAdd} added to usersWithMoreThen2Rooms`);
  console.log(usersWithMoreThen2Rooms);
};
const remoceUserFromExcept = (userToRemove) => {
  let indexOfUser = usersWithMoreThen2Rooms.indexOf(userToRemove);
  if (indexOfUser > -1) {
    usersWithMoreThen2Rooms.splice(indexOfUser, 1);
    console.log(`User ${userToRemove} removed from usersWithMoreThen2Rooms`);
    console.log(usersWithMoreThen2Rooms);
  } else {
    console.log("User not found");
  }
};
io.on("connection", (socket) => {
  // Lytter på alle meldinger som kommer til "mainRoomToSend"
  socket.on("mainRoomToSend", (msg, room) => {
    console.log(`Message: ${msg}`);
    console.log(`Room: ${room}`);
    // Om "room" ikke er med i meldingen fra klinet, send melding til alle som lytter på mainRoomToSend
    if (room == null) {
      // socket.broadcast.emit sender ikke melding tilbake til den som sendte meldingen først
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", msg);
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
    addUserToExcept(id);
    console.log(`${id} joined ${room}`);
    // console.log(socket.rooms);
  });

  // Fjerner bruker fra ønsket room
  socket.on("Leave-Room", (room, id) => {
    socket.leave(room);
    remoceUserFromExcept(id);
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
    console.log(`Bruker: ${socket.id}, Rooms:[${arrayOfRooms}]`);
    socket.emit("get-rooms-user", arrayOfRooms, showMsg);
    // console.log(showMsg);
  });
  socket.on("disconnect", () => {
    remoceUserFromExcept(socket.id);
    console.log(`${socket.id} disconnected`);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
