//window object

//canvas variables
var canvas; // the canvas
var context; // used for drawing on the canvas
var canvasWidth = 1300;
var canvasHeight = 600;
var TIME_INTERVAL = 10; // screen refresh interval in milliseconds
var intervalTimer;
var Score;

var rotateAngle = 0;
var FRIENDLY_SPEED = 10;
var FRIENDLY_FIRE_SPEED = 2;
var EnemyFireCount;
var EnemyFireSpeed;

var FIRE_COUNT;
var users;
var logedInUser;
var level;
var lives;

var EnemyMove;

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var UP_KEY = 38;
var DOWN_KEY = 40;
var FIRE_KEY = 32;

//game variables
var NumRows = 4;
var NumCols = 5;
var WidthDistanceFactor = 0.8;
var HeightEnemy = 0.4;
var HeightFriendly = 0.4;
var floorY;
var topY;
var floorY = canvasWidth * 0.8;
var topY = canvasWidth * 0.6;
var friendly_ship;
var ENEMY_SPEED; // Enemy speed multiplier

// variables for the game loop and tracking statistics

var timerCount; // number of times the timer fired since the last second
var timeLeft; // the amount of time left in seconds
var timeElapsed; // the number of seconds elapsed

function SpaceShip(x, y) {
  this.x = x;
  this.y = y;
}
function FriendlySpaceShip(x, y) {
  SpaceShip.call(this, x, y);
  this.FireNum = 0;
  this.img = new Image();
  this.img.src = "happyMonkey.png";
  this.FIRE_ARR = [];
  this.draw = function () {
    context.drawImage(this.img, this.x, this.y, 80, 80);
    for (var i = 0; i < this.FireNum; i++) {
      this.FIRE_ARR[i].draw();
    }
  };
  this.moveDown = function () {
    this.y = Math.min(this.y + FRIENDLY_SPEED, canvasHeight - 80);
  };
  this.moveUp = function () {
    this.y = Math.max(this.y - FRIENDLY_SPEED, canvasHeight * 0.6);
  };
  this.moveLeft = function () {
    this.x = Math.max(this.x - FRIENDLY_SPEED, 0);
  };
  this.moveRight = function () {
    this.x = Math.min(this.x + FRIENDLY_SPEED, canvasWidth - 80);
  };
  this.fire = function () {
    FIRE_COUNT--;
    this.FIRE_ARR.push(new FriendlyFire(this.x, this.y));
    this.FireNum++;
  };
  this.moveFiers = function () {
    for (var i = 0; i < this.FireNum; i++) {
      this.FIRE_ARR[i].move();
    }
  };
}

function EnemySpaceShip(x, y) {
  this.isAlive = true;
  this.img = new Image();
  this.img.src = "enemy.png";
  SpaceShip.call(this, x, y);
  this.draw = function () {
    if (this.isAlive == false) {
      return;
    }
    context.drawImage(this.img, this.x, this.y, 80, 80);
  };
  this.move = function () {
    if (EnemyMove == "right") {
      this.x = Math.min(this.x + ENEMY_SPEED, canvasWidth - 80);
    } else if (EnemyMove == "left") {
      this.x = Math.max(this.x - ENEMY_SPEED, 0);
    }
  };
}

function FriendlyFire(x, y) {
  this.x = x;
  this.y = y;
  this.img = new Image();
  this.img.src = "banana.png";
  this.FIRE_ARR = [];
  this.draw = function () {
    if (this.y <= -10) {
      friendly_ship.FIRE_ARR = friendly_ship.FIRE_ARR.filter(
        (item) => item != this
      );
      friendly_ship.FireNum--;
      FIRE_COUNT++;
    }
    context.drawImage(this.img, this.x + 15, this.y - 10, 50, 50);

    for (let i = 0; i < NumRows; i++) {
      for (let j = 0; j < NumCols; j++) {
        if (
          enemy_ships[i][j].isAlive &&
          Math.abs(enemy_ships[i][j].x - this.x + 25) < 50 &&
          Math.abs(enemy_ships[i][j].y - this.y - 10) <= 50
        ) {
          enemy_ships[i][j].isAlive = false;
          friendly_ship.FIRE_ARR = friendly_ship.FIRE_ARR.filter(
            (item) => item != this
          );
          friendly_ship.FireNum--;
          FIRE_COUNT++;
          Score += 5 * (4 - i);
          document.getElementById("Score").innerHTML = "Score:" + Score;
        }
      }
    }
  };
  this.move = function () {
    this.y = Math.max(this.y - FRIENDLY_FIRE_SPEED, -100);
  };
}

function EnemyFire(x, y) {
  this.x = x;
  this.y = y;
  this.img = new Image();
  this.img.src = "rocket.png";
  this.final = false;
  this.draw = function () {
    if (
      Math.abs(friendly_ship.x - this.x) < 50 &&
      Math.abs(friendly_ship.y - this.y - 10) <= 50
    ) {
      lives--;
      EnemyFireCount++;
      document
        .getElementById("heartLI")
        .removeChild(document.getElementById("heartLI").lastChild);
      EnemyFireARR = EnemyFireARR.filter((item) => item != this);
    }
    context.drawImage(this.img, this.x, this.y, 50, 50);
  };
  this.move = function () {
    this.y = Math.min(this.y + EnemyFireSpeed, canvasHeight + 100);
  };
}

function User(username, password, email, birthday, firstname, lastname) {
  this.username = username;
  this.password = password;
  this.email = email;
  this.birthday = birthday;
  this.firstname = firstname;
  this.lastname = lastname;
}

// called when the app first launches
function setupGame() {
  var default_user = new User(
    "p",
    "testuser",
    "Admin@Admin.com",
    "01.01.2023",
    "Admin",
    "Admin"
  );
  users = { p: default_user };
  // add event listeners
  document.getElementById("Login_btn").addEventListener("click", goLogin);
  document.getElementById("SumbitLogin").addEventListener("click", sumbitLogin);
  document.getElementById("SignUp_btn").addEventListener("click", goSignUp);
  document
    .getElementById("SumbitSignUp")
    .addEventListener("click", sumbitSignUp);
  document.getElementById("Home_menu").addEventListener("click", goHome);
  document.getElementById("About_menu").addEventListener("click", goAbout);
  document.getElementById("Logout_menu").addEventListener("click", logOut);
  document.getElementById("StartButton").addEventListener("click", startGame);
  document.addEventListener("keydown", function (event) {
    keyDownHandler(event);
  });

  // get the canvas element
  canvas = document.getElementById("theCanvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext("2d");
}

function keyDownHandler(event) {
  switch (event.keyCode) {
    case LEFT_KEY: // left arrow
      friendly_ship.moveLeft();
      break;
    case RIGHT_KEY: // right arrow
      friendly_ship.moveRight();
      break;
    case UP_KEY: // up arrow
      friendly_ship.moveUp();
      break;
    case DOWN_KEY: // down arrow
      friendly_ship.moveDown();
      break;
    case FIRE_KEY: // space bar
      if (FIRE_COUNT > 0) {
        friendly_ship.fire();
      }
      break;
  }
}

function LoadGame() {
  muteDivs();
  document.getElementById("Game").style.display = "flex";
  if (canvas != undefined) {
    canvas.style.display = "flex";
  }
  inGame = false;
}

function goLogin() {
  muteDivs();
  document.getElementById("Login").style.display = "flex";
}
function goSignUp() {
  muteDivs();
  document.getElementById("SignUp").style.display = "flex";
}
function goHome() {
  muteDivs();
  document.getElementById("Welcome").style.display = "flex";
}
function goAbout() {
  muteDivs();
}
function logOut() {
  canvas.style.display = "none";
  logedInUser = undefined;

  document.getElementById("Home_menu").style.display = "flex";
  document.getElementById("Logout_menu").style.display = "none";
  document.getElementById("Score").style.display = "none";
  document.getElementById("TimerTable").style.display = "none";
  while (document.getElementById("heartLI").firstChild) {
    document
      .getElementById("heartLI")
      .removeChild(document.getElementById("heartLI").firstChild);
  }
  document.getElementById("heartLI").style.display = "none";

  document.body.style.backgroundImage = "url('background.png')";

  stopTimer();
  goHome();
}
function muteDivs() {
  document.getElementById("Welcome").style.display = "none";
  document.getElementById("Login").style.display = "none";
  document.getElementById("SignUp").style.display = "none";
  document.getElementById("Configuration").style.display = "none";
  document.getElementById("Game").style.display = "none";
  document.getElementById("EndGame").style.display = "none";
  document.getElementById("Score").style.display = "none";
  document.getElementById("TimerTable").style.display = "none";
  while (document.getElementById("heartLI").firstChild) {
    document
      .getElementById("heartLI")
      .removeChild(document.getElementById("heartLI").firstChild);
  }
  document.getElementById("heartLI").style.display = "none";
}

function sumbitLogin() {
  let username = document.getElementById("Login_username").value;
  let password = document.getElementById("Login_password").value;
  if (users[username] == undefined) {
    document.getElementById("Login_username").style.color = "red";
  } else if (users[username].password != password) {
    document.getElementById("Login_password").style.color = "red";
  } else {
    logedInUser = users[username];
    goConfiguration();
  }
}

function goConfiguration() {
  muteDivs();
  document.getElementById("Home_menu").style.display = "none";
  document.getElementById("Logout_menu").style.display = "flex";

  document.getElementById("Configuration").style.display = "flex";
}
function sumbitSignUp() {
  let username = document.getElementById("SignUp_username").value;
  let password = document.getElementById("SignUp_password").value;
  let confirmPassword = document.getElementById("SignUp_confirmPassword").value;
  let email = document.getElementById("SignUp_email").value;
  let birthday = document.getElementById("SignUp_birthday").value;
  let firstname = document.getElementById("SignUp_firstname").value;
  let lastname = document.getElementById("SignUp_lastname").value;

  if (
    checkSetUp(username, password, email, firstname, lastname, confirmPassword)
  ) {
    users[username] = new User(
      username,
      password,
      email,
      birthday,
      firstname,
      lastname
    );
    logedInUser = users[username];
    document.getElementById("Home_menu").style.color = "black";
    goConfiguration();
  }
}

function checkSetUp(
  username,
  password,
  email,
  firstname,
  lastname,
  confirmPassword
) {
  // check if password includes numbers and letters (at least 8 characters)

  if (users[username] != undefined) {
    alert("Username already exist");
    return false;
  }
  const passwordRegex = /^([A-Za-z0-9]){8,}$/;
  if (!password.match(passwordRegex)) {
    alert(
      "Password must include at least 8 characters with numbers and letters." +
        password
    );
    return false;
  }

  // check if first name and last name do not include numbers
  const nameRegex = /^[A-Za-z]+$/;
  if (!firstname.match(nameRegex) || !lastname.match(nameRegex)) {
    alert(
      "First name and last name must not include numbers." +
        firstname +
        " " +
        lastname
    );
    return false;
  }

  // check if email is valid
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email.match(emailRegex)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // check if password fields match
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true;
}
function resetElements() {
  Score = 0;
  EnemyMove = "right";
  EnemyFireARR = [];

  document.getElementById("heartLI").style.display = "flex";
  document.getElementById("Score").innerHTML = "Score:" + Score;
  document.getElementById("TimerTable").style.display = "flex";
  timerCount = 0;
  timeElapsed = 0;
  if (level == 1) {
    FIRE_COUNT = 3;
    lives = 3;
    EnemyFireCount = 1;
    ENEMY_SPEED = 0.4;
    EnemyFireSpeed = 0.5;
    timeLeft = 120;
  } else if (level == 2) {
    FIRE_COUNT = 2;
    lives = 2;
    EnemyFireCount = 2;
    ENEMY_SPEED = 0.6;
    EnemyFireSpeed = 0.7;
    timeLeft = 90;
  } else if (level == 3) {
    FIRE_COUNT = 1;
    lives = 1;
    EnemyFireCount = 3;
    ENEMY_SPEED = 0.8;
    EnemyFireSpeed = 0.9;
    timeLeft = 60;
  }
  while (document.getElementById("heartLI").childElementCount < lives) {
    var _img = document.createElement("img");
    _img.src = "heartLogo.png";
    var li = document.getElementById("heartLI");
    li.appendChild(_img);
  }
  friendly_ship = new FriendlySpaceShip(
    WidthDistanceFactor * Math.random() * canvasWidth,
    canvasHeight - 80
  );
  enemy_ships = Array(NumRows)
    .fill()
    .map(() => Array(NumCols));
  for (let i = 0; i < NumRows; i++) {
    for (let j = 0; j < NumCols; j++) {
      enemy_ships[i][j] = new EnemySpaceShip(
        (j * canvasWidth * 0.7) / NumCols,
        (i * canvasHeight * 0.5) / NumRows
      );
    }
  }
}
function startGame() {
  muteDivs();
  document.getElementById("Score").style.display = "flex";
  if (document.getElementById("easy-button").checked) {
    level = 1;
  } else if (document.getElementById("normal-button").checked) {
    level = 2;
  } else if (document.getElementById("hard-button").checked) {
    level = 3;
  }
  document.getElementById("Game").style.display = "flex";
  document.body.style.backgroundImage = "url('gameBackground.png')";
  if (canvas != undefined) {
    canvas.style.display = "flex";
  }
  resetElements();
  stopTimer();
  inGame = true;
  startTimer();
}

function enemy_fire() {
  let x_rand = Math.floor(Math.random() * NumCols);
  let y_rand = Math.floor(Math.random() * NumRows);
  if (enemy_ships[x_rand][y_rand].isAlive == true) {
    if (EnemyFireCount > 0) {
      EnemyFireCount--;
      EnemyFireARR.push(
        new EnemyFire(
          enemy_ships[x_rand][y_rand].x,
          enemy_ships[x_rand][y_rand].y
        )
      );
    }
  }

  for (let i = 0; i < EnemyFireARR.length; i++) {
    if (
      EnemyFireARR[i].final == false &&
      EnemyFireARR[i].y > canvasHeight * 0.7
    ) {
      EnemyFireARR[i].final = true;
      EnemyFireCount++;
    }
  }

  for (let i = 0; i < EnemyFireARR.length; i++) {
    if (EnemyFireARR[i].y - 30 > canvasHeight) {
      EnemyFireARR = EnemyFireARR.filter((item) => item != EnemyFireARR[i]);
    }
  }
}

function stopTimer() {
  window.clearInterval(intervalTimer);
}
function startTimer() {
  intervalTimer = window.setInterval(updatePositions, TIME_INTERVAL);
}

function updatePositions() {
  rotateAngle += 1;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  friendly_ship.draw();
  friendly_ship.moveFiers();
  enemy_fire();
  moveEnemyShips();
  refreshTimer();
  checkEndGame();
}
function refreshTimer() {
  ++timerCount;
  if (TIME_INTERVAL * timerCount >= 1000) {
    --timeLeft; // decrement the timer
    ++timeElapsed; // increment the time elapsed
    timerCount = 0; // reset the count
  } // end if
  min = timeLeft / 60;
  min = Math.floor(min);
  seconds = timeLeft % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  strTimer = min + ":" + seconds;
  document.getElementById("TimerText").innerHTML = strTimer;
}
function checkEndGame() {
  if (timeLeft <= 0 || lives <= 0) {
    //lose
    muteDivs();
    document.getElementById("EndGame").style.display = "flex";
    stopTimer();
  } else if (Score == 250) {
    //win

    muteDivs();
    document.getElementById("EndGame").style.display = "flex";
    stopTimer();
  }
}

function moveEnemyShips() {
  if (
    EnemyMove == "right" &&
    enemy_ships[0][NumCols - 1].x >= canvasWidth - 80
  ) {
    EnemyMove = "left";
  } else if (EnemyMove == "left" && enemy_ships[0][0].x <= 0) {
    EnemyMove = "right";
  }
  for (let i = 0; i < NumRows; i++) {
    for (let j = 0; j < NumCols; j++) {
      enemy_ships[i][j].move();
      enemy_ships[i][j].draw();
    }
  }
  for (let i = 0; i < EnemyFireARR.length; i++) {
    EnemyFireARR[i].move();
    EnemyFireARR[i].draw();
  }
}
window.addEventListener("load", setupGame, false);
