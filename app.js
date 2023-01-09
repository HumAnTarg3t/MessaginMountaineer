const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readFromDB } = require("./MongoDBAssets/mongoDB");
require("./LoginExpress");
require("./MessagingServer");
const app = require("express")();
const http = require("http").Server(app);
const port = process.env.PORT || 3000;
const { randomUUID } = require("crypto");
let csrfToken = randomUUID();
// console.log(csrfToken);

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3002",
    methods: "POST",
  })
);
app.use(express.json({ type: "application/json" }));

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

app.get("/", (req, res) => {
  res.redirect("http://localhost:3002/login");
});

app.post("/Api/v1/Post", async (req, res, next) => {
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
    readFromDB(process.env.mongoDB_Client_dev, "UsersTable").catch(console.dir);
    res.send(data);
  } else {
    res.statusCode = 400;
    res.send("content-type feil, forventer application/json");
    console.log(req.headers);
  }
});

http.listen(port, () => {
  console.log(`App login server running at http://localhost:${port}/`);
});
