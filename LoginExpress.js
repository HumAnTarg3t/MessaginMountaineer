const dotenv = require("dotenv").config();
const proxy = require("express-http-proxy");
const express = require("express");
const morgan = require("morgan");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT2 || 3002;
// import { readFromDB } from "./mongoDB.js";
const { readFromDB } = require("./mongoDB");
app.use(morgan("dev"));
app.use(express.static(__dirname + "public2"));
//app.use("/", proxy("https://messaginmountaineer.glitch.me" + '/'))

//app.use('/Login2', proxy("messaginmountaineer.glitch.me" + '/login'))
app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/public2/LoginClient.html");
  //res.sendFile("/Public2/LoginClient.html");
});
//console.log(process.env.DOMAIN_NAME)
http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
