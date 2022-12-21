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
  console.log("usersWithMoreThen2Rooms :"+usersWithMoreThen2Rooms);
};
const removeUserFromExcept = (userToRemove) => {
  let indexOfUser = usersWithMoreThen2Rooms.indexOf(userToRemove);
  if (indexOfUser > -1) {
    usersWithMoreThen2Rooms.splice(indexOfUser, 1);
    console.log(`User ${userToRemove} removed from usersWithMoreThen2Rooms`);
    console.log("usersWithMoreThen2Rooms :"+usersWithMoreThen2Rooms);
  } else {
    console.log("User not found");
  }
};

io.on("connection", (socket) => {
  const sendUserLoggedOnOffMsg = (id, status, room) => {
    const userJoinedMessage = `User: ${id} has joined`;
    const userLeftMessage = `User: ${id} left`;
    if (!room && status) {
      console.log("Sender userJoinedMsg til alle utenom usersWithMoreThen2Rooms");
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", userJoinedMessage);
    } else if (room && status) {
      console.log("Sender userJoinedMsg til alle i et room");
      socket.to(room).emit("mainRoomToReceive", userJoinedMessage, room);
    } else if (!room && !status) {
      console.log("Sender UserLeftMsg til alle utenom usersWithMoreThen2Rooms");
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", userLeftMessage);
    } else if (room && !status) {
      console.log("Sender UserLeftMsg til alle i et room");
      socket.to(room).emit("mainRoomToReceive", userLeftMessage, room);
      console.log("Sender userJoinedMsg til alle utenom usersWithMoreThen2Rooms");
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", userJoinedMessage);
    }
  };
  // Lytter på alle meldinger som kommer til "mainRoomToSend"
  sendUserLoggedOnOffMsg(socket.id, true);
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
    if (room) {
      socket.join(room);
      addUserToExcept(id);
      sendUserLoggedOnOffMsg(socket.id, true, room);
      console.log(`${id} joined ${room}`);
    } else {
      sendUserLoggedOnOffMsg(socket.id, true);
    }
    // console.log(socket.rooms);
  });

  // Fjerner bruker fra ønsket room
  socket.on("Leave-Room", (room, id) => {
    socket.leave(room);
    removeUserFromExcept(id);
    console.log(11111111111111111111111111111111111111111111111111111 + id);
    sendUserLoggedOnOffMsg(socket.id, false, room);
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
    removeUserFromExcept(socket.id);
    sendUserLoggedOnOffMsg(socket.id, false);
    console.log(`${socket.id} disconnected`);
  });
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
