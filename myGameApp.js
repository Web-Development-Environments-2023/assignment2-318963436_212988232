//window object

//canvas variables
var canvas; // the canvas
var context; // used for drawing on the canvas
var canvasWidth = 1300;
var canvasHeight = 600;
var TIME_INTERVAL = 2; // screen refresh interval in milliseconds
var MultiplyFactor = 1.2;
var intervalTimer;
var timeElapsed; // the number of seconds elapsed
var Score;
var inGame = false;

var rotateAngle = 0;
var FRIENDLY_SPEED = 20;
var FRIENDLY_FIRE_SPEED = 2;
var MAXSCORE = 250;
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
var PrizeSpeed; // Prize speed multiplier

//sounds
var HitSound;
var BananaSound;
var BackgroundSound;
var FriendlyHitSound;
var WinGameSound;
var LoseGameSound;

var bananas = [];
var enemy_imgs = [];

// variables for the game loop and tracking statistics

var timerCount; // number of times the timer fired since the last second
var timeLeft; // the amount of time left in seconds
var timeElapsed; // the number of seconds elapsed

// variables for dialog boxes
var settingsCancelBtn;
var settingsDialog;
var aboutCancelBtn;
var aboutDialog;

var Prizes=[];

function chnageFireKey(key) {
  FIRE_KEY = key;
}



function ClockPrize(x, y) {
  this.x = x;
  this.y = y;
  this.img = new Image();
  this.img.src = "resourses/prizes/PrizeClock.png";
  this.draw = function () {
    if (
      Math.abs(friendly_ship.x - this.x) < 50 &&
      Math.abs(friendly_ship.y - this.y - 10) <= 50
    ) {
      timeLeft += 3;
      Prizes=Prizes.filter((prize) => prize != this);
    }
    context.drawImage(this.img, this.x, this.y, 50, 50);
  };
  this.move = function () {
    this.y = Math.min(this.y + PrizeSpeed, canvasHeight + 100);
  };
}

function BananaPrize(x, y) {
  this.x = x;
  this.y = y;
  this.img = new Image();
  this.img.src = "resourses/prizes/PrizeBanana.png";
  this.draw = function () {
    if (
      Math.abs(friendly_ship.x - this.x) < 50 &&
      Math.abs(friendly_ship.y - this.y - 10) <= 50
    ) {
      FIRE_COUNT += 1;
      Prizes=Prizes.filter((prize) => prize != this);
    }
    context.drawImage(this.img, this.x, this.y, 50, 50);
  };
  this.move = function () {
    this.y = Math.min(this.y + PrizeSpeed, canvasHeight + 100);
  };
}

function HeartPrize(x, y) {
  this.x = x;
  this.y = y;
  this.img = new Image();
  this.img.src = "resourses/prizes/PrizeHeart.png";
  this.draw = function () {
    if (
      Math.abs(friendly_ship.x - this.x) < 50 &&
      Math.abs(friendly_ship.y - this.y - 10) <= 50
    ) {
      lives += 1;
      var _img = document.createElement("img");
    _img.src = "resourses/logos/heartLogo.png";
    var li = document.getElementById("heartLI");
    li.appendChild(_img);
    Prizes=Prizes.filter((prize) => prize != this);

    }
    context.drawImage(this.img, this.x, this.y, 50, 50);
  };
  this.move = function () {
    this.y = Math.min(this.y + PrizeSpeed, canvasHeight + 100);
  };
}






function SpaceShip(x, y) {
  this.x = x;
  this.y = y;
}
function FriendlySpaceShip(x, y) {
  SpaceShip.call(this, x, y);
  this.FireNum = 0;
  this.img = new Image();
  this.img.src = "resourses/characters/happyMonkey.png";
  this.FIRE_ARR = [];
  this.draw = function () {
    context.drawImage(this.img, this.x, this.y, 80, 100);
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

function EnemySpaceShip(x, y, img) {
  this.isAlive = true;
  this.img = img;
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
  this.FIRE_ARR = [];
  this.isAlive = true;
  this.draw = function () {
    if (this.isAlive == false) {
      return;
    }
    if (this.y <= -10) {
      friendly_ship.FIRE_ARR = friendly_ship.FIRE_ARR.filter(
        (item) => item != this
      );
      friendly_ship.FireNum--;
      FIRE_COUNT++;
    }
    context.drawImage(
      bananas[rotateAngle / 3],
      this.x + 15,
      this.y - 10,
      50,
      50
    );

    for (let i = 0; i < NumRows; i++) {
      for (let j = 0; j < NumCols; j++) {
        if (
          enemy_ships[i][j].isAlive &&
          Math.abs(enemy_ships[i][j].x - this.x + 25) < 50 &&
          Math.abs(enemy_ships[i][j].y - this.y - 10) <= 50
        ) {
          enemy_ships[i][j].isAlive = false;
          this.isAlive = false;
          friendly_ship.FIRE_ARR = friendly_ship.FIRE_ARR.filter(
            (item) => item != this
          );
          friendly_ship.FireNum--;
          FIRE_COUNT++;
          Score += 5 * (4 - i);
          document.getElementById("Score").innerHTML = "Score:" + Score;
          HitSound.pause();
          HitSound.play();
          rand=Math.random();
          if (rand<0.24)
          {
            if (rand<0.08){
              
              Prizes.push(new HeartPrize(enemy_ships[i][j].x,enemy_ships[i][j].y));
            }
            else if(rand<0.16){
              Prizes.push(new BananaPrize(enemy_ships[i][j].x,enemy_ships[i][j].y));
            }
            else{
              Prizes.push(new ClockPrize(enemy_ships[i][j].x,enemy_ships[i][j].y));
            }
          }
          return;
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
  this.img.src = "resourses/logos/rocket.png";
  this.final = false;
  this.draw = function () {
    if (
      Math.abs(friendly_ship.x - this.x+25) < 50 &&
      Math.abs(friendly_ship.y - this.y ) <= 40
    ) {
      lives--;
      EnemyFireCount++;
      document
        .getElementById("heartLI")
        .removeChild(document.getElementById("heartLI").lastChild);
      EnemyFireARR = [];
      EnemyFireCount = 4-Math.max(level,1);

      FriendlyHitSound.play();
      EnemyFireCount=Math.max(level,1);
      friendly_ship.x = WidthDistanceFactor * Math.random() * canvasWidth;
      friendly_ship.y = canvasHeight - 80;
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
  this.lastscores = [];
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

  document.getElementById("Custom-button").addEventListener("change", () => {
    if (document.getElementById("Custom-button").checked) {
      document.getElementById("TimeCustom").style.display = "flex";
    }
  });
  document.getElementById("easy-button").addEventListener("change", () => {
    if (document.getElementById("easy-button").checked) {
      document.getElementById("TimeCustom").style.display = "none";
    }
  });
  document.getElementById("normal-button").addEventListener("change", () => {
    if (document.getElementById("normal-button").checked) {
      document.getElementById("TimeCustom").style.display = "none";
    }
  });
    
  document.getElementById("hard-button").addEventListener("change", () => {
    if (document.getElementById("hard-button").checked) {
      document.getElementById("TimeCustom").style.display = "none";
    }
  });
    
    
  
  
    
  
  
  for (var i = 0; i < 120; i++) {
    bananas.push(new Image());
    bananas[i].src = `resourses/bananas/banana` + i * 3 + ".png";
  }
  for (var i = 0; i < 4; i++) {
    enemy_imgs.push(new Image());
    enemy_imgs[i].src = `resourses/characters/enemy` + i + ".png";
  }
  users = { p: default_user };
  // add event listeners
  document.getElementById("Login_btn").addEventListener("click", goLogin);
  document.getElementById("SumbitLogin").addEventListener("click", sumbitLogin);
  document.getElementById("SignUp_btn").addEventListener("click", goSignUp);
  document
    .getElementById("SumbitSignUp")
    .addEventListener("click", sumbitSignUp);
  document.getElementById("Home_menu").addEventListener("click", goHome);
  document.getElementById("Logout_menu").addEventListener("click", logOut);
  document.getElementById("StartButton").addEventListener("click", startGame);
  document.getElementById("Restart_btn").addEventListener("click", restartGame);
  document
    .getElementById("Exit_btn")
    .addEventListener("click", goConfiguration);
  document.addEventListener("keydown", function (event) {
    keyDownHandler(event);
  });

  // get the canvas element
  canvas = document.getElementById("theCanvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext("2d");

  // get sounds
  HitSound = document.getElementById("Hit");
  HitSound.playbackRate = 2;
  FriendlyHitSound = document.getElementById("FriendlyHit");
  FriendlyHitSound.playbackRate = 1.5;
  BananaSound = document.getElementById("FriendlyFire");
  BackgroundSound = document.getElementById("background_music");
  WinGameSound = document.getElementById("WinGame");
  LoseGameSound = document.getElementById("LoseGame");
  // Play the audio on loop
  BackgroundSound.addEventListener(
    "ended",
    function () {
      this.play();
    },
    false
  );

  // get the settings dialog
  settingsDialog = document.getElementById("settingsDialog");
  settingsCancelBtn = document.getElementById("settingsCancelBtn");

  document
    .getElementById("Settings_menu")
    .addEventListener("click", function () {
      stopTimer();
      settingsDialog.showModal();
    });

  settingsCancelBtn.addEventListener("click", function () {
    settingsDialog.close();
    if (inGame) {
      startTimer();
    }
  });

  // get the about dialog
  aboutDialog = document.getElementById("AboutDialog");
  aboutCancelBtn = document.getElementById("aboutCancelBtn");

  document.getElementById("About_menu").addEventListener("click", function () {
    stopTimer();
    aboutDialog.showModal();
  });

  aboutCancelBtn.addEventListener("click", function () {
    aboutDialog.close();
    if (inGame) {
      startTimer();
    }
  });

  window.addEventListener("click", function (event) {
    if (event.target == aboutDialog || event.target == settingsDialog) {
      closeDialog();
      if (inGame) {
        startTimer();
      }
    }
  });

  // Close the dialog when the user presses the ESC key
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDialog();
      if (inGame) {
        startTimer();
      }
    }
  });
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
        BananaSound.pause();
        BananaSound.play();
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
  inGame = false;
  document.getElementById("Welcome").style.display = "flex";
}
function logOut() {
  inGame = false;
  canvas.style.display = "none";
  logedInUser = undefined;
  BackgroundSound.pause();
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

  document.body.style.backgroundImage =
    "url('resourses/backgrounds/background.png')";

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
  document.body.style.backgroundImage =
    "url('resourses/backgrounds/background.png')";
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
  PrizeSpeed = 0.5;
  Prizes = [];
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
  else if (level == 0) {
    FIRE_COUNT = 3;
    lives = 3;
    EnemyFireCount = 1;
    ENEMY_SPEED = 0.4;
    EnemyFireSpeed = 0.5;
    timeLeft = 60*document.getElementById("TimeCustom").value;
  }
  while (document.getElementById("heartLI").childElementCount < lives) {
    var _img = document.createElement("img");
    _img.src = "resourses/logos/heartLogo.png";
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
        (i * canvasHeight * 0.5) / NumRows,
        enemy_imgs[i]
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
  else if (document.getElementById("Custom-button").checked){
    level=0
  }
  document.getElementById("Game").style.display = "flex";
  document.body.style.backgroundImage =
    "url('resourses/backgrounds/gameBackground.png')";
  if (canvas != undefined) {
    canvas.style.display = "flex";
  }
  resetElements();
  stopTimer();
  inGame = true;
  BackgroundSound.play();
  startTimer();
}

function enemy_fire() {
  let x_rand = Math.floor(Math.random() * NumCols);
  let y_rand = Math.floor(Math.random() * NumRows);

  if (enemy_ships[y_rand][x_rand].isAlive == true) {
    if (EnemyFireCount > 0) {
      EnemyFireCount--;
      EnemyFireARR.push(
        new EnemyFire(
          enemy_ships[y_rand][x_rand].x,
          enemy_ships[y_rand][x_rand].y
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
  rotateAngle = (rotateAngle + 3) % 360;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  friendly_ship.draw();
  friendly_ship.moveFiers();
  enemy_fire();
  moveEnemyShips();
  movePrizes();
  refreshTimer();
  checkEndGame();

}
function movePrizes() {
  for (let i = 0; i < Prizes.length; i++) {
    prize=Prizes[i];
    Prizes[i].move();
    Prizes[i].draw();
    if(prize!=Prizes[i]){
      i--;
      continue;
    }

  }
  for (let i = 0; i < Prizes.length; i++) {
    if (Prizes[i].y > canvasHeight) {
      Prizes = Prizes.filter((item) => item != Prizes[i]);
    }
  }

}
function refreshTimer() {
  ++timerCount;
  if (TIME_INTERVAL * timerCount >= 500) {
    --timeLeft; // decrement the timer
    ++timeElapsed; // increment the time elapsed
    if (timeElapsed <= 20 && timeElapsed % 5 == 0) {
      EnemyFireSpeed *= MultiplyFactor;
      ENEMY_SPEED *= MultiplyFactor;
    }
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
  if (lives <= 0 || Score == MAXSCORE || timeLeft <= 0) {
    inGame = false;
    muteDivs();
    document.getElementById("EndGame").style.display = "flex";
    stopTimer();
    BackgroundSound.pause();
    let levelfunc = function (level) {
      if (level == 1) {
        return "easy";
      } else if (level == 2) {
        return "normal";
      } else if (level == 3){
        return "hard";
      }
      else if (level == 0){
        return "Custom";
      }
    };
    let gameScore = {
      score: Score,
      time: timeElapsed,
      level: levelfunc(level),
      date: new Date().toLocaleString(),
    };
    let inScoreBoard = false;
    logedInUser.lastscores.push(gameScore);
    lastscoresTable = document.getElementById("lastscores");
    for (let i = lastscoresTable.rows.length - 1; i > 0; i--) {
      // Delete the current row from the table
      lastscoresTable.deleteRow(i);
    }
    logedInUser.lastscores.sort(function (a, b) {
      if (a.score !== b.score) {
        return b.score - a.score; // Sort by score in descending order
      } else {
        return a.timeElapsed - b.timeElapsed; // If scores are equal, sort by time in ascending order
      }
    });
    for (let i = 0; i < Math.min(logedInUser.lastscores.length, 5); i++) {
      const newRow = lastscoresTable.insertRow();
      const rankCell = newRow.insertCell();
      const scoreCell = newRow.insertCell();
      const timeCell = newRow.insertCell();
      const levelCell = newRow.insertCell();
      const dateCell = newRow.insertCell();
      // Set the cell contents for the new row
      rankCell.innerText = i + 1;
      scoreCell.innerText = logedInUser.lastscores[i]["score"];
      timeCell.innerText = logedInUser.lastscores[i]["time"];
      levelCell.innerText = logedInUser.lastscores[i]["level"];
      dateCell.innerText = logedInUser.lastscores[i]["date"];
      if (logedInUser.lastscores[i] == gameScore) {
        newRow.style.background = "rgba(240, 230, 140, 0.5)";
        inScoreBoard = true;
      }
    }
    if (!inScoreBoard) {
      const newRow = lastscoresTable.insertRow();
      const rankCell = newRow.insertCell();
      const scoreCell = newRow.insertCell();
      const timeCell = newRow.insertCell();
      const levelCell = newRow.insertCell();
      const dateCell = newRow.insertCell();
      // Set the cell contents for the new row
      rankCell.innerText = logedInUser.lastscores.indexOf(gameScore) + 1;
      scoreCell.innerText = Score;
      timeCell.innerText = timeElapsed;
      levelCell.innerText = levelfunc(level);
      dateCell.innerText = new Date().toLocaleString();
      newRow.style.background = "rgba(240, 230, 140, 0.5)";
    }

    if (lives <= 0) {
      //lose
      document.getElementById("WinloseTxt").innerHTML = "You Lost";
      LoseGameSound.play();
    } else if (Score == MAXSCORE) {
      //win
      document.getElementById("WinloseTxt").innerHTML = "Champion!";
      WinGameSound.play();
    } else {
      if (Score < 100) {
        //lose
        document.getElementById("WinloseTxt").innerHTML = "You can do better";
        LoseGameSound.play();
      }
      //win
      else {
        document.getElementById("WinloseTxt").innerHTML = "Champion!";
        WinGameSound.play();
      }
    }
  }
}
function restartGame() {
  startGame();
}
function closeDialog() {
  aboutDialog.close();
  settingsDialog.close();
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
    fire=EnemyFireARR[i];
    EnemyFireARR[i].move();
    if(fire!=EnemyFireARR[i]){
      i--;
      continue;
    }
    EnemyFireARR[i].draw();
  }
}
window.addEventListener("load", setupGame, false);
