const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = require("express")();
const http = require("http").Server(app);
const port = process.env.PORT2 || 3002;
const { readFromDB } = require("./MongoDBAssets/mongoDB");

app.use(morgan("dev"));
app.use(express.static("./public2/"));
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

app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/public2/LoginClient.html");
});

app.post("/Api/v1/Post/Login", async (req, res) => {
  const data = await req.body;
  let jsonBodyKeys = Object.keys(data);
  const reqKeyForRequest = ["Username", "pwd"];
  if (
    req.headers["content-type"] == "application/json" &&
    compareArrays(jsonBodyKeys, reqKeyForRequest)
  ) {
    readFromDB(process.env.mongoDB_Client_dev, "UsersTable", {
      UserName: data.Username,
    }).then((responseFromDB) => {
      if (responseFromDB) {
        res.send("User found");
        // redirect til messagingclient med AUTH (auth er ikke på plass ennå)
      } else {
        // redirect til setup page
        res.send("User not found");
      }
    });
    console.log(data);
  } else {
    res.statusCode = 400;
    res.send("content-type feil, forventer application/json");
    console.log(req.headers);
  }
});

app.post("/Api/v1/Post/Register", async (req, res) => {
  const data = await req.body;
  let jsonBodyKeys = Object.keys(data);
  const reqKeyForRequest = ["Register_Login", "Register_pwd", "Register_Email"];
  console.log(data);
  if (
    req.headers["content-type"] == "application/json" &&
    compareArrays(jsonBodyKeys, reqKeyForRequest)
  ) {
    //send hashed info til DB og redirect til chat med auth
    res.send("Signed up");
  } else {
    res.statusCode = 400;
    res.send("Bad req");
  }
});

http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
