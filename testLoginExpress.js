const dotenv = require("dotenv").config();
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;
// import { readFromDB } from "./mongoDB.js";
const { readFromDB } = require("./mongoDB");
app.use(express.static(__dirname + "/public/"));
app.get("/", (req, res) => {
  //   res.sendFile(__dirname + "/Public/LoginClient.html");
  res.redirect("http://localhost:3000/MessagingClient");
});

http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
