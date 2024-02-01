//Websocekt variables
const url = "ws://localhost:3000/myWebsocket";
const mywsServer = new WebSocket(url);

let img;
angleValue = 0.1;

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
let iCap;
let topFacingLeft = false;

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
    if (parsed["event"] === "accelerometer_angle") {
      if (accelerometerXValues.length > 5) {
        accelerometerXValues.shift();
        XAngleValue = movingAverage(
          accelerometerXValues.slice(
            accelerometerXValues.length - 5,
            accelerometerXValues.length
          )
        );
      }
      if (accelerometerZValues.length > 5) {
        accelerometerZValues.shift();
        ZAngleValue = movingAverage(
          accelerometerZValues.slice(
            accelerometerZValues.length - 5,
            accelerometerZValues.length
          )
        );
      }

      accelerometerXValues.push(-parsed["x"]);
      accelerometerZValues.push(parsed["z"]);
      // magnetometerPointing = parsed["z"];
      /*
        ZAngleValue -> Y Direction
        XAngleValue -> Z Direction 
        magnetometerPointing -> X Direction
      */
      if (ZAngleValue > 0) {
        console.log("Pointing Right");
      } else {
        console.log("Pointing left");
      }

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

function preload() {
  img = loadImage("/assets/cli.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  iCap = createVector(1, 0, 0);
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

  texture(img);
  box(100);
  pop();
}
