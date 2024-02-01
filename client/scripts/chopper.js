//Websocekt variables
const url = "ws://localhost:3000/myWebsocket";
const mywsServer = new WebSocket(url);

let ZAngleValue;

mywsServer.onmessage = function (event) {
  const { data } = event;
  try {
    const parsed = JSON.parse(data);
    if (parsed["event"] === "gyroscope") {
      ZAngleValue = parsed["z"];
      // console.log(parsed["z"]);
    }
    if (parsed["event"] === "shake") {
      if (ZAngleValue < 0) {
        leftRightKeyPress("right");
      } else {
        leftRightKeyPress("left");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

let bottomOffset = 200;
let woodHeight = 200;
let lumberjackimage;
let axeimage;
let wood = {};
let woodbranchimage;
let lumberjackstunnedhead;
let lumberjackstunnedbody;

class Wood {
  constructor(woodtype, nitem) {
    this.woodtype = woodtype;
    this.col = { x: 0, y: 0, z: 0 };
    this.col.r = random(0, 255);
    this.col.g = random(0, 255);
    this.col.b = random(0, 255);
    this.beingcrushed = false;
    this.height = woodHeight;
    this.nitem = nitem;
  }

  display(order) {
    let toppos = {
      x: windowWidth / 2,
      y: windowHeight - bottomOffset - order * woodHeight,
    };
    fill(this.col.r, this.col.g, this.col.b);
    rect(toppos.x, toppos.y + (woodHeight - this.height), 100, this.height);
    image(
      wood[`wood${(this.nitem % 2) + 1}`],
      toppos.x,
      toppos.y + (woodHeight - this.height),
      100,
      this.height
    );

    if (this.woodtype === "rightbranch") {
      // fill(255, 255, 255);
      image(
        woodbranchimage,
        toppos.x + 100,
        toppos.y + 50,
        woodHeight,
        woodHeight / 2
      );
    } else if (this.woodtype === "leftbranch") {
      // fill(255, 255, 255);
      rect(toppos.x - 10, toppos.y, 10, woodHeight);
      push();
      scale(-1, 1);
      image(
        woodbranchimage,
        -toppos.x + 100 - woodHeight / 2,
        toppos.y + 50,
        woodHeight,
        woodHeight / 2
      );
      pop();
    }

    if (this.beingcrushed) {
      this.height -= 40;

      // this.whilecrushingcallback(mapValue(this.height, 0, woodHeight, 0, 1));
      if (this.height <= 0) {
        this.crushcallback();
      }
    }
  }

  crush(crushcallback) {
    this.beingcrushed = true;
    // this.whilecrushingcallback = whilecrushingcallback;
    this.crushcallback = crushcallback;
  }
}

class Lumberjack {
  constructor(hittingside) {
    this.hittingside = hittingside;
    this.hitting = false;
    this.hittingprogress = 0;
    this.stunned = false;
    this.stunnedcount = 0;
  }

  getposition() {
    return {
      x:
        this.hittingside === "left"
          ? windowWidth / 2 - 200
          : windowWidth / 2 + 100,
      y: windowHeight - 200 - woodHeight * 1.5,
    };
  }

  display() {
    let position = this.getposition();
    if (!this.stunned) {
      image(lumberjackimage, position.x, position.y, 200, woodHeight * 1.5);
      // image(axeimage, position.x + 100, position.y + 50, 100, 200);
    } else {
      image(
        lumberjackstunnedbody,
        position.x,
        position.y + woodHeight * 1.5 - (woodHeight * 3) / 4,
        150,
        (woodHeight * 3) / 4
      );

      push();
      translate(
        position.x + 25 + 100,
        position.y +
          woodHeight * 1.5 -
          (woodHeight * 3) / 4 -
          woodHeight / 2 +
          100
      );
      rotate(mapValue(Math.sin(millis() / 500), -1, 1, -PI / 2, PI / 2));
      image(lumberjackstunnedhead, 0, -100, -100, (woodHeight * 3) / 4);
      pop();

      this.stunnedcount += 1;

      if (this.stunnedcount === 60 * 2) {
        this.stunned = false;
        this.stunnedcount = 0;
        this.hittingside = this.hittingside === "left" ? "right" : "left";
      }
      // fill(255, 0, 0);
      // rect(position.x + 50, position.y + 50, 100, 100);
    }
    if (this.hittingside === "left") {
      push();
      translate(position.x + 125, position.y + 50 + 200);
      rotate((PI / 180) * (this.hittingprogress * 90));
      image(axeimage, 0, -200, 100, 200);
      pop();
    } else {
      push();
      translate(position.x + 75, position.y + 50 + 200);
      rotate((PI / 180) * (-this.hittingprogress * 90));
      scale(-1, 1);
      image(axeimage, 0, -200, 100, 200);
      pop();
    }
    this.hitanimation();
  }

  hitanimation() {
    if (this.hitting) {
      this.hittingprogress += 0.1;
      if (this.hittingprogress >= 1) {
        this.hitting = false;
      }
    } else {
      if (this.hittingprogress >= 0) {
        this.hittingprogress -= 0.1;
      }
    }
  }

  hit() {
    this.hitting = true;
  }
}

let woodarray = [];
let hittingside = "right";
let lumberjack;
let lastbranchtype = "leftbranch";
let nobranchcount = 0;
let score = 0;
let nwood = 0;

function mapValue(value, min, max, newMin, newMax) {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}

function createWood() {
  nwood += 1;
  // if (lastbranch) {
  //   nobranchcount += 1;
  //   return new Wood("nobranch");
  // }
  let woodtype = Math.floor(Math.random() * 10) < 3 ? "branch" : "nobranch";
  if (woodtype === "branch") {
    // woodtype = Math.random() < 0.5 ? "leftbranch" : "rightbranch";

    if (lastbranchtype === "leftbranch" && nobranchcount <= 2) {
      woodtype = "leftbranch";
    } else if ((lastbranchtype = "rightbranch" && nobranchcount <= 2)) {
      woodtype = "rightbranch";
    } else {
      woodtype = Math.random() < 0.5 ? "leftbranch" : "rightbranch";
    }
    nobranchcount = 0;
    lastbranchtype = woodtype;
  } else if (woodtype === "nobranch") {
    nobranchcount += 1;
  }
  return new Wood(woodtype, nwood);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    woodarray.push(createWood());
  }

  lumberjackimage = loadImage("./assets/lumberjack.png");
  axeimage = loadImage("./assets/axe.png");

  lumberjack = new Lumberjack(hittingside);

  wood["wood1"] = loadImage("./assets/wood1.png");
  wood["wood2"] = loadImage("./assets/wood2.png");

  woodbranchimage = loadImage("./assets/woodbranch.png");

  lumberjackstunnedbody = loadImage("./assets/bodystunned.png");
  lumberjackstunnedhead = loadImage("./assets/headstunned.png");
}

function draw() {
  background(220);

  fill(255, 255, 255);
  rect(0, windowHeight - 200, windowWidth, 200);

  //   woodarray[1].display(1);

  for (let i = 0; i < woodarray.length; i++) {
    const wood = woodarray[i];

    wood.display(i + 1);
  }

  lumberjack.display();
}

function leftRightKeyPress(type) {
  hittingside = type;
  if (
    woodarray[0].woodtype === `${type}branch` ||
    woodarray[1].woodtype === `${type}branch` ||
    woodarray[2].woodtype === `${type}branch`
  ) {
    lumberjack.stunned = true;
  }
  lumberjack.hittingside = hittingside;
  woodarray[0].crush(() => {
    woodarray.shift();
    woodarray.push(createWood());
    lumberjack.hit();
  });
  score += 1;
}

function keyPressed() {
  if (lumberjack.stunned) {
    return;
  }

  if (keyCode === LEFT_ARROW) {
    leftRightKeyPress("left");
  } else if (keyCode === RIGHT_ARROW) {
    leftRightKeyPress("right");
  }
}
