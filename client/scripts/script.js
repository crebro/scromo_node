//Websocekt variables
const url = "ws://localhost:3000/myWebsocket";
const mywsServer = new WebSocket(url);
angleValue = 0.1;

let img;

//DOM Elements
// const myMessages = document.getElementById("messages");
// const myInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

sendBtn.disabled = true;
// sendBtn.addEventListener("click", sendMsg, false);

//Sending message from client
// function sendMsg() {
//   const text = myInput.value;
//   msgGeneration(text, "Client");
//   mywsServer.send(text);
// }

// //Creating DOM element to show received messages on browser page
// function msgGeneration(msg, from) {
//   const newMessage = document.createElement("h5");
//   newMessage.innerText = `${from} says: ${msg}`;
//   myMessages.appendChild(newMessage);
// }

//enabling send message when connection is open
mywsServer.onopen = function () {
  sendBtn.disabled = false;
};

const accelerometerXValues = [];
const accelerometerZValues = [];
const magnetometerValues = [];

let magnetometerPointing = 0;
let XAngleValue = 0;
let ZAngleValue = 0;

// //handling message event
mywsServer.onmessage = function (event) {
  const { data } = event;
  try {
    const parsed = JSON.parse(data);
    // if (parsed["event"] === "accelerometer") {
    //   if (lastFiveValues.length > 5) {
    //     accelerometerValues.shift();
    //     angleValue = -movingAverage(
    //       lastFiveValues.slice(lastFiveValues.length - 5, lastFiveValues.length)
    //     );
    //   }
    //   lastFiveValues.push(parsed["x"]);
    //   // moving average
    // }
    if (parsed["event"] === "gyroscope") {
      if (magnetometerValues.length > 5) {
        magnetometerValues.shift();
        magnetometerPointing = -movingAverage(
          magnetometerValues.slice(
            magnetometerValues.length - 5,
            magnetometerValues.length
          )
        );
      }

      if (accelerometerXValues.length > 5) {
        accelerometerXValues.shift();
        XAngleValue = -movingAverage(
          accelerometerXValues.slice(
            accelerometerXValues.length - 5,
            accelerometerXValues.length
          )
        );
      }

      if (accelerometerZValues.length > 5) {
        accelerometerZValues.shift();
        ZAngleValue = -movingAverage(
          accelerometerZValues.slice(
            accelerometerZValues.length - 5,
            accelerometerZValues.length
          )
        );
      }

      // accelerometerXValues.push(parsed["x"]);
      // accelerometerZValues.push(parsed["z"]);
      // magnetometerValues.push(parsed["y"]);
      XAngleValue = -parsed["x"];
      ZAngleValue = parsed["y"];
      magnetometerPointing = parsed["z"];

      // moving average
    }
  } catch (e) {}
};

function movingAverage(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum / arr.length;
}

function mapValue(value, min, max, newMin, newMax) {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   console.log(windowWidth, windowHeight);
// }

// function draw() {
//   background(220);
//   angleMode(DEGREES);
//   line(
//     width / 2,
//     height,
//     width / 2 + (height / 2) * tan(mapValue(angleValue, -10, 10, -90, 90)),
//     height / 2
//   );
// }

function preload() {
  img = loadImage("/assets/cli.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(250);

  normalMaterial();
  push();

  translate(0, -100, 0);
  angleMode(DEGREES);

  rotateX(XAngleValue);
  rotateZ(ZAngleValue);
  rotateY(magnetometerPointing);
  // console.log(XAngleValue);
  // rotateX(frameCount);
  // rotateZ(XAngleValue);
  // rotateZ(XAngleValue);
  // rotateY(0);
  texture(img);
  box(100);
  pop();
}
