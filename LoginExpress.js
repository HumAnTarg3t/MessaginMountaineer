const dotenv = require("dotenv").config();
const proxy = require("express-http-proxy");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT2 || 3002;
// import { readFromDB } from "./mongoDB.js";
const { readFromDB } = require("./MongoDBAssets/mongoDB");
app.use(morgan("dev"));
app.use(express.static("./public2/"));
//app.use("/", proxy("https://messaginmountaineer.glitch.me" + '/'))

//app.use('/Login2', proxy("messaginmountaineer.glitch.me" + '/login'))
app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/public2/LoginClient.html");
  //res.sendFile("/Public2/LoginClient.html");
});

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3002"],
    methods: "POST",
  })
);
app.use(express.json({ type: "application/json" }));

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

app.post("/Api/v1/Post", async (req, res) => {
  const data = await req.body;
  let jsonBodyKeys = Object.keys(data);
  const reqKeyForRequest = ["Username", "pwd"];
  // console.log(`Keys from post: ${jsonBodyKeys}`);
  // console.log(req.headers);
  // console.log(`Keys required for post: ${reqKeyForRequest}`);
  if (
    req.headers["content-type"] == "application/json" &&
    compareArrays(jsonBodyKeys, reqKeyForRequest)
  ) {
    // readFromDB(process.env.mongoDB_Client_dev, "UsersTable").catch(console.dir);
    console.log(data);
    res.send({ heh: "wqe" });
  } else {
    res.statusCode = 400;
    res.send("content-type feil, forventer application/json");
    console.log(req.headers);
  }
});

//console.log(process.env.DOMAIN_NAME)
http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
