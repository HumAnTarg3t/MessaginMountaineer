// const dotenv = require("dotenv").config();
const express = require("express");
// const { Router } = require("express");
// const proxy = require("express-http-proxy");
const morgan = require("morgan");
// const { createProxyMiddleware } = require("http-proxy-middleware");
require("./LoginExpress");
require("./MessagingServer");

const app = require("express")();
const http = require("http").Server(app);
// const io = require("socket.io")(http);
// const router = Router();
// const options = {
//   target: "http://localhost:3002/Login",
//   changeOrigin: true,
//   pathRewrite: {
//     [`^/api/users/all`]: "OWOW",
//   },
// };
const port = process.env.PORT || 3000;
app.use(morgan("dev"));

app.post("/Api/v1/Post", (req, res) => {
  res.send("Vises i app, uten proxy");
});

// // router.get("/login", createProxyMiddleware(options));
// app.use("/login", proxy("http://localhost:3002/Login"));
// // app.use("/chat", proxy("http://localhost:3001/MessagingClient"));
// app.get("/login", (req, res) => {
//   res.render("http://localhost:3002/login");
// });
// app.get("/chat", (req, res) => {
//   res.redirect("http://localhost:3001/MessagingClient");
// });
http.listen(port, () => {
  console.log(`App login server running at http://localhost:${port}/`);
});
