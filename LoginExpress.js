const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = require("express")();
const http = require("http").Server(app);
const port = process.env.PORT2 || 3002;
const { readFromDB, writeToDB } = require("./MongoDBAssets/mongoDB");
const { hashSomething, comparehash } = require("./bcryptFunctions");

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
  const reqKeyForRequest = ["Register_Login", "Register_pwd", "Register_Email"];
  let jsonBodyKeys = Object.keys(data);
  let hashedRegister_pwd = await hashSomething(data.Register_pwd);
  const date = new Date();
  let doesUserexist = await readFromDB(
    process.env.mongoDB_Client_dev,
    "UsersTable",
    {
      UserName: data.Username,
    }
  );

  console.log(data);
  console.log(doesUserexist);
  if (
    req.headers["content-type"] == "application/json" &&
    compareArrays(jsonBodyKeys, reqKeyForRequest) &&
    doesUserexist === "false"
  ) {
    //send hashed info til DB og redirect til chat med auth
    await writeToDB(process.env.mongoDB_Client_dev, "UsersTable", {
      UserName: data.Register_Login,
      pwd: hashedRegister_pwd,
      mail: data.Register_Email,
      ActiveStatus: true,
      AccountCreated: date,
      RoomId: "Double(qweqweqwe.0)",
    });
    console.log(hashedRegister_pwd);
    res.send(hashedRegister_pwd);
  } else {
    res.statusCode = 400;
    res.send("Bad req");
  }
});

http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
