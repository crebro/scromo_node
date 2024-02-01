const WebSocket = require("ws");
const express = require("express");
const app = express();
const path = require("path");

app.use("/", express.static(path.resolve(__dirname, "./client")));

const myServer = app.listen(3000, () => {
  console.log("Server running on port 3000");
}); // regular http server using node express which serves your webpage'

const wsServer = new WebSocket.Server({
  noServer: true,
}); // a websocket server

wsServer.on("connection", function (ws) {
  console.log("connected");
  // what should a websocket do on connection
  ws.on("message", function (msg) {
    console.log("recieved");
    // what to do on message event
    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // check if client is ready
        client.send(msg.toString());
      }
    });
  });
});

myServer.on("upgrade", async function upgrade(request, socket, head) {
  //emit connection when request accepted
  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit("connection", ws, request);
  });
});
