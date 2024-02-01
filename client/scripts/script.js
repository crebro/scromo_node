//Websocekt variables
const url = "ws://localhost:3000/myWebsocket";
const mywsServer = new WebSocket(url);
angleValue = 0.1;

let img;
const sendBtn = document.getElementById("send");

sendBtn.disabled = true;

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
    if (parsed["event"] === "gyroscope") {
      XAngleValue = -parsed["x"];
      ZAngleValue = parsed["y"];
      magnetometerPointing = parsed["z"];
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
