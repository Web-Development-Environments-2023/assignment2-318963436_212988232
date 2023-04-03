// Fig. 14.27 cannon.js
// Logic of the Cannon Game
var canvas; // the canvas
var context; // used for drawing on the canvas
var canvasWidth;
var canvasHeight;

var floorY;
var topY;

//users and passswords
var user1 = {
  password: "testuser",
  email: "p",
  birthday: "p",
  firstname: "p",
  lastname: "p",
};
var users = {
  p: user1,
};

// constants for the game
function SpaceShip(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.image = new Image();
  // this.image.src = "images/ship.png";
  this.draw = function () {
    context.fillStyle = "red";
    context.beginPath();

    context.arc(
      this.x + width / 2,
      this.y + height / 2,
      this.width / 60,
      0,
      2 * Math.PI,
      false
    );

    context.fill();
  };
}
function FriendlySpaceShip(x, y, width, height) {
  this.numlife = 3;
  SpaceShip.call(this, x, y, width, height);
  //   this.image.src = "images/ship.png";
  this.moveDown = function () {
    this.y = Math.min(this.y + FRIENDLY_SPEED, floorY);
  };
  this.moveUp = function () {
    this.y = Math.max(this.y - FRIENDLY_SPEED, topY);
  };
  this.moveLeft = function () {
    this.x = Math.max(this.x - FRIENDLY_SPEED, 0);
  };
  this.moveRight = function () {
    this.x = Math.min(this.x + FRIENDLY_SPEED, canvasWidth * 0.9);
  };
}

function EnemySpaceShip(x, y, width, height) {
  this.isAlive = true;
  SpaceShip.call(this, x, y, width, height);
  //   this.image.src = "images/enemy.png";
  this.move = function () {
    if (EnemyMove == "right") {
      this.x = Math.min(this.x + ENEMY_SPEED, canvasWidth * 0.9);
    } else if (EnemyMove == "left") {
      this.x = Math.max(this.x - ENEMY_SPEED, 0);
    }
  };
}

//EnemySpaceShips
var enemy_ships;
var friendly_ship;
var inGame;
var EnemyMove;
var change_direction;

//game variables
var NumRows = 4;
var NumCols = 5;
var WidthDistanceFactor = 0.8;
var HeightEnemy = 0.4;
var HeightFriendly = 0.4;

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var UP_KEY = 38;
var DOWN_KEY = 40;
var FIRE_KEY = 32;

// constants for game play

var TIME_INTERVAL = 10; // screen refresh interval in milliseconds
var ENEMY_SPEED = 0.5; // Enemy speed multiplier
var FRIENDLY_SPEED = 1; // Friendly speed multiplier

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timerCount; // number of times the timer fired since the last second
var timeLeft; // the amount of time left in seconds
var shotsFired; // the number of shots the user has fired
var timeElapsed; // the number of seconds elapsed

// variables for the blocker and target
var blocker; // start and end points of the blocker
var blockerDistance; // blocker distance from left
var blockerBeginning; // blocker distance from top
var blockerEnd; // blocker bottom edge distance from top
var initialBlockerVelocity; // initial blocker speed multiplier
var blockerVelocity; // blocker speed multiplier during game

var target; // start and end points of the target
var targetDistance; // target distance from left
var targetBeginning; // target distance from top
var targetEnd; // target bottom's distance from top
var pieceLength; // length of a target piece
var initialTargetVelocity; // initial target speed multiplier
var targetVelocity; // target speed multiplier during game

var lineWidth; // width of the target and blocker
var hitStates; // is each target piece hit?
var targetPiecesHit; // number of target pieces hit (out of 7)

// variables for the cannon and cannonball
var cannonball; // cannonball image's upper-left corner
var cannonballVelocity; // cannonball's velocity
var cannonballOnScreen; // is the cannonball on the screen
var cannonballRadius; // cannonball radius
var cannonballSpeed; // cannonball speed
var cannonBaseRadius; // cannon base radius
var cannonLength; // cannon barrel length
var barrelEnd; // the end point of the cannon's barrel
var canvasWidth; // width of the canvas
var canvasHeight; // height of the canvas

// variables for sounds
var targetSound;
var cannonSound;
var blockerSound;

// called when the app first launches
function setupGame() {
  //menu buttons
  document.getElementById("Home_menu").addEventListener("click", goHome);
  document.getElementById("About_menu").addEventListener("click", goAbout);
  document
    .getElementById("Configuration_menu")
    .addEventListener("click", goConfiguration);

  document.getElementById("Login_menu").addEventListener("click", goLogin);
  document.getElementById("SignUp_menu").addEventListener("click", goSignUp);

  //loginpress
  document.getElementById("Login_btn").addEventListener("click", goLogin);
  document.getElementById("SignUp_btn").addEventListener("click", goSignUp);

  document.getElementById("SumbitLogin").addEventListener("click", sumbitLogin);
  document
    .getElementById("SumbitSignUp")
    .addEventListener("click", sumbitSignUp);

  document.getElementById("startButton").addEventListener("click", newGame);

  document.addEventListener("keydown", function (event) {
    keyDownHandler(event);
  });

  inGame = false;
  EnemyMove = "right";
  change_direction = false;

  // get the canvas and context
  canvas = document.getElementById("theCanvas");
  context = canvas.getContext("2d");
} // end function setupGame

// set up interval timer to update game
function startTimer() {
  intervalTimer = window.setInterval(updatePositions, TIME_INTERVAL);
} // end function startTimer

// terminate interval timer
function stopTimer() {
  window.clearInterval(intervalTimer);
} // end function stopTimer

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {
  let w = canvas.width;
  let h = canvas.height;
  floorY = h * 0.8;
  topY = h * 0.6;
  canvasWidth = w;
  canvasHeight = h;

  friendly_ship = new FriendlySpaceShip(
    WidthDistanceFactor * Math.random() * canvasWidth,
    floorY,
    50,
    50
  );
  enemy_ships = Array(NumRows)
    .fill()
    .map(() => Array(NumCols));
  for (let i = 0; i < NumRows; i++) {
    for (let j = 0; j < NumCols; j++) {
      enemy_ships[i][j] = new EnemySpaceShip(
        j * ((canvasWidth * WidthDistanceFactor) / NumCols),
        i * (canvasHeight / NumRows) * HeightEnemy,
        (canvasWidth * WidthDistanceFactor) / NumCols,
        (canvasHeight * HeightEnemy) / NumRows
      );
    }
  }
} // end function resetElements

// reset all the screen elements and start a new game
function newGame() {
  // set up the game

  resetElements();
  stopTimer();
  inGame = true;

  startTimer();
} // end function newGame

// called every TIME_INTERVAL milliseconds
function updatePositions() {
  moveEnemyShips();
  draw(); // draw all elements at updated positions
} // end function updatePositions

// fires a cannonball
function fireCannonball(event) {} // end function fireCannonball

// aligns the cannon in response to a mouse click
function alignCannon(event) {} // end function alignCannon

// draws the game elements to the given Canvas
function draw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  friendly_ship.draw();
  for (let i = 0; i < NumRows; i++) {
    for (let j = 0; j < NumCols; j++) {
      enemy_ships[i][j].draw();
    }
  }
} // end function draw

// display an alert when the game ends
function showGameOverDialog(message) {} // end function showGameOverDialog

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
  document.querySelector("#About").showModal();
  document.getElementById("About").style.display = "flex";
  document.getElementById("dialogOK").addEventListener("click", function () {
    document.getElementById("About").style.display = "none";
    document.getElementById("About").close();
  });
}
function goConfiguration() {}

function LoadGame() {
  muteDivs();
  document.getElementById("Game").style.display = "flex";
}
function muteDivs() {
  document.getElementById("Game").style.display = "none";
  document.getElementById("Login").style.display = "none";
  document.getElementById("SignUp").style.display = "none";
  document.getElementById("Welcome").style.display = "none";
}

function sumbitLogin() {
  let username = document.getElementById("Login_username").value;
  let password = document.getElementById("Login_password").value;
  if (users[username] == undefined) {
    alert("Username does not exist");
  } else if (users[username].password != password) {
    alert("Incorrect Password");
  } else {
    muteDivs();
    LoadGame();
  }
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
    users[username] = {
      password: password,
      email: email,
      birthday: birthday,
      firstname: firstname,
      lastname: lastname,
    };
    muteDivs();
    LoadGame();
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

function keyDownHandler(event) {
  if (inGame) {
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
        friendly_ship.fireCannonball();
        break;
    }
  }
}
function moveEnemyShips() {
  if (
    EnemyMove == "right" &&
    enemy_ships[0][NumCols - 1].x + enemy_ships[0][NumCols - 1].width >=
      canvasWidth
  ) {
    EnemyMove = "left";
  } else if (EnemyMove == "left" && enemy_ships[0][0].x <= 0) {
    EnemyMove = "right";
  }
  for (let i = 0; i < NumRows; i++) {
    for (let j = 0; j < NumCols; j++) {
      enemy_ships[i][j].move();
    }
  }
}

window.addEventListener("load", setupGame, false);

/*************************************************************************
 * (C) Copyright 1992-2012 by Deitel & Associates, Inc. and               *
 * Pearson Education, Inc. All Rights Reserved.                           *
 *                                                                        *
 * DISCLAIMER: The authors and publisher of this book have used their     *
 * best efforts in preparing the book. These efforts include the          *
 * development, research, and testing of the theories and programs        *
 * to determine their effectiveness. The authors and publisher make       *
 * no warranty of any kind, expressed or implied, with regard to these    *
 * programs or to the documentation contained in these books. The authors *
 * and publisher shall not be liable in any event for incidental or       *
 * consequential damages in connection with, or arising out of, the       *
 * furnishing, performance, or use of these programs.                     *
 *************************************************************************/
