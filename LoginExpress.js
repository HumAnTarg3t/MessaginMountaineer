const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectId;
const app = require("express")();
const http = require("http").Server(app);
const cookieParser = require("cookie-parser");
const port = process.env.PORT2 || 3002;
const { readFromDB, writeToDB, updateTableInDB, DelTableInDB } = require("./MongoDBAssets/mongoDB");
const { hashSomething, comparehash } = require("./bcryptFunctions");

// app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("./public2/"));
app.use(
  cors({
    origin: ["http://localhost:3002"],
    methods: "POST",
  })
);
app.use(
  express.json({
    type: "application/json",
  })
);

const compareArrays = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const defaultParamChecker = (reqHeaders, jsonBodyKeys, reqKeyForRequest) => {
  if (reqHeaders == "application/json" && compareArrays(jsonBodyKeys, reqKeyForRequest)) {
    return true;
  } else {
    return false;
  }
};
// console.log(uuidv4());
// console.log(uuidv4());

app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/public2/LoginClient.html");
});

app.post("/Api/v1/Post/Login", async (req, res, next) => {
  const data = await req.body;
  const sessionToken = uuidv4();
  let jsonBodyKeys = Object.keys(data);
  const reqKeyForRequest = ["Username", "pwd"];

  if (defaultParamChecker(req.headers["content-type"], jsonBodyKeys, reqKeyForRequest)) {
    readFromDB(process.env.mongoDB_Client_dev, "UsersTable", {
      UserName: data.Username,
    }).then((responseFromDB) => {
      if (responseFromDB && comparehash(data.pwd, responseFromDB[0].pwd)) {
        writeToDB(process.env.mongoDB_Client_dev, "SessionTable", {
          UserName: data.Username,
          sessionToken: sessionToken,
        });
        // res.redirect("/MessagingClient");
        try {
          res.clearCookie("LoginCookie");
        } catch (error) {
          console.log("No cookie");
        }
        res.cookie("LoginCookie", `${sessionToken},${data.Username}`, {
          maxAge: 60000,
          httpOnly: true,
          sameSite: "none",
          secure: "True",
        });
        // res.set("Set-Cookie", `loginToken=${sessionToken}; Secure; HttpOnly; Max-Age=60; SameSite=None`);
        res.send({
          response: "User found",
          sessionToken: sessionToken,
          url: "http://localhost:3001/MessagingClient",
        });
        // res.status(301).redirect("http://localhost:3001/MessagssingClient");
        // redirect til messagingclient med AUTH (auth er ikke på plass ennå)
      } else {
        // redirect til setup page
        res.send({ response: "User not found/wrong username or password" });
      }
      next();
    });
  } else {
    res.statusCode = 400;
    res.send({ response: "content-type feil, forventer application/json" });
    console.log(req.headers);
  }
});

app.get("/Api/v1/Post/Logout", async (req, res) => {
  readFromDB(process.env.mongoDB_Client_dev, "SessionTable", {
    UserName: req.query.username,
  }).then((responseFromDB) => {
    if (!responseFromDB) {
      res.send({ response: "Ingen sesjon funnet" });
    } else {
      console.log(responseFromDB[0]._id);
      DelTableInDB(process.env.mongoDB_Client_dev, "SessionTable", { _id: ObjectId(responseFromDB[0]._id) });
      res.send({ response: "Session slettet" });
    }
  });
  console.log(req.query);
});

//  ------------------------------------------------------------------------------------------ REGISTER ------------------------------------------------------------------------------------------
app.post("/Api/v1/Post/Register", async (req, res) => {
  const data = await req.body;
  const reqKeyForRequest = ["Register_Login", "Register_pwd", "Register_Email"];
  let jsonBodyKeys = Object.keys(data);
  const date = new Date();
  let doesUserexist = await readFromDB(process.env.mongoDB_Client_dev, "UsersTable", {
    UserName: data.Register_Login,
  });

  if (defaultParamChecker(req.headers["content-type"], jsonBodyKeys, reqKeyForRequest) && !doesUserexist) {
    const hashedRegister_pwd = await hashSomething(data.Register_pwd);
    await writeToDB(process.env.mongoDB_Client_dev, "UsersTable", {
      UserName: data.Register_Login,
      pwd: hashedRegister_pwd,
      mail: data.Register_Email,
      ActiveStatus: true,
      AccountCreated: date,
      RoomId: "",
    });
    res.send({ response: "User created" });
  } else if (
    defaultParamChecker(req.headers["content-type"], jsonBodyKeys, reqKeyForRequest) &&
    doesUserexist !== "false"
  ) {
    res.statusCode = 400;
    res.send({ response: "User exists" });
  } else {
    res.statusCode = 400;
    res.send({ response: "Bad req" });
  }
});

http.listen(port, () => {
  console.log(`Express login server running at http://localhost:${port}/`);
});
