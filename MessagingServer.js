const dotenv = require("dotenv").config();
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
require("./testLoginExpress");
// import { readFromDB } from "./mongoDB.js";
const { readFromDB } = require("./mongoDB");
app.use(express.static(__dirname + "/public/"));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/Public/LoginClient.html");
// });

app.get("/MessagingClient", (req, res) => {
  res.sendFile(__dirname + "/Public/MessaginClient.html");
});

let usersWithMoreThen2Rooms = [];
let allusersID = [];
const addUserToExcept = (userToAdd) => {
  usersWithMoreThen2Rooms.push(userToAdd);
  console.log(`User ${userToAdd} added to usersWithMoreThen2Rooms`);
  console.log("usersWithMoreThen2Rooms :" + usersWithMoreThen2Rooms);
};
const removeUserFromExcept = (userToRemove) => {
  let indexOfUser = usersWithMoreThen2Rooms.indexOf(userToRemove);
  if (indexOfUser > -1) {
    usersWithMoreThen2Rooms.splice(indexOfUser, 1);
    console.log(`User ${userToRemove} removed from usersWithMoreThen2Rooms`);
    console.log("usersWithMoreThen2Rooms :" + usersWithMoreThen2Rooms);
  } else {
    console.log("User not found");
  }
};

io.on("connection", async (socket) => {
  const sockets = await io.fetchSockets();
  for (const socket of sockets) {
    // console.log(socket.id);
    // console.log(socket.handshake);
    // console.log(socket.rooms);
    // console.log(socket.data);
    if (!allusersID.includes(socket.id)) {
      allusersID.push(socket.id);
    } else {
      console.log(123123123123);
    }
  }
  console.log(`Alle bruker array: ${allusersID}`);
  const sendUserLoggedOnOffMsg = (id, notSendToUsersInArray, room) => {
    const userJoinedMessage = `User: ${id} has joined`;
    const userLeftMessage = `User: ${id} left`;
    if (!room && notSendToUsersInArray) {
      console.log(
        "Sender userJoinedMsg til alle utenom usersWithMoreThen2Rooms"
      );
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", userJoinedMessage);
    } else if (room && notSendToUsersInArray) {
      console.log("Sender userJoinedMsg til alle i et room");
      socket.to(room).emit("mainRoomToReceive", userJoinedMessage, room);
    } else if (!room && !notSendToUsersInArray) {
      console.log("Sender UserLeftMsg til alle utenom usersWithMoreThen2Rooms");
      socket.broadcast
        .except(usersWithMoreThen2Rooms)
        .emit("mainRoomToReceive", userLeftMessage);
    } else if (room && !notSendToUsersInArray) {
      console.log("Sender UserLeftMsg til alle i et room");
      socket.to(room).emit("mainRoomToReceive", userLeftMessage, room);
      console.log(
        "Sender userJoinedMsg til alle utenom usersWithMoreThen2Rooms"
      );
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
    if (room && !allusersID.includes(room)) {
      socket.join(room);
      addUserToExcept(id);
      sendUserLoggedOnOffMsg(socket.id, true, room);
      console.log(`${id} joined ${room}`);
    } else if (allusersID.includes(room)) {
      const customRoom = room + "------" + id;
      socket.join(customRoom);
      addUserToExcept(id);
      socket.emit("Join-Custom-Room", customRoom, id);
      // Det mangler no en funksjon ett eller annet sted der det blir
      // opprettet en custom kanal og en inv er sendt til client 2
      const testMeldinFor1v1Samtale = `skal vi snakke privat? Room: ${customRoom}`;
      socket.to(room).emit("mainRoomToReceive", testMeldinFor1v1Samtale, room);
      console.log(`${id} joined ${room}`);
    } else {
      sendUserLoggedOnOffMsg(socket.id, true);
    }
  });

  // Fjerner bruker fra ønsket room
  socket.on("Leave-Room", (room, id) => {
    socket.leave(room);
    removeUserFromExcept(id);
    // sendUserLoggedOnOffMsg(socket.id, false, room);
    console.log(`${id} disconnected from: ${room}`);
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
  });
  socket.on("disconnect", () => {
    removeUserFromExcept(socket.id);
    sendUserLoggedOnOffMsg(socket.id, false);
    allusersID.pop(socket.id);
    console.log(allusersID);
    console.log(`${socket.id} disconnected`);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
