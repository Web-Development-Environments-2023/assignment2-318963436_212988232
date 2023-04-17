var FIRE_KEY = 32;
keys_elements = [];

//
var test;
//

const keyMap = {
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  0: 48,
  backspace: 8,
  q: 81,
  w: 87,
  e: 69,
  r: 82,
  t: 84,
  y: 89,
  u: 85,
  i: 73,
  o: 79,
  p: 80,
  a: 65,
  s: 83,
  d: 68,
  f: 70,
  g: 71,
  h: 72,
  j: 74,
  k: 75,
  l: 76,
  enter: 13,
  done: 13,
  z: 90,
  x: 88,
  c: 67,
  v: 86,
  b: 66,
  n: 78,
  m: 77,
  ",": 188,
  ".": 190,
  "?": 191,
  space: 32,
};

const keyMap = {
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "0": 48,
    "backspace": 8,
    "q": 81,
    "w": 87,
    "e": 69,
    "r": 82,
    "t": 84,
    "y": 89,
    "u": 85,
    "i": 73,
    "o": 79,
    "p": 80,
    "a": 65,
    "s": 83,
    "d": 68,
    "f": 70,
    "g": 71,
    "h": 72,
    "j": 74,
    "k": 75,
    "l": 76,
    "enter": 13,
    "done": 13,
    "z": 90,
    "x": 88,
    "c": 67,
    "v": 86,
    "b": 66,
    "n": 78,
    "m": 77,
    ",": 188,
    ".": 190,
    "?": 191,
    "space": 32
  };

function on_press(element) {
  FIRE_KEY = keyMap[element.innerHTML];
}
function clearKeyboard() {
  for (var i = 0; i < keys_elements.length; i++) {
    keys_elements[i].style.background = "rgba(0, 0, 0, 0.4)";
  }
}
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.getElementById("settingsDialog").appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "backspace",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "enter",
      "done",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
      "space",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
      keys_elements.push(keyElement);
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            FIRE_KEY = 8;
            clearKeyboard();
            keyElement.style.background = "rgba(0, 0, 0, 0.8)";
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            FIRE_KEY = 13;
            clearKeyboard();
            keyElement.style.background = "rgba(0, 0, 0, 0.8)";
            v;
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.style.background = "rgba(0, 0, 0, 0.8)";

          keyElement.addEventListener("click", () => {
            FIRE_KEY = 32;
            clearKeyboard();
            keyElement.style.background = "rgba(0, 0, 0, 0.8)";
          });

          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            chnageFireKey(FIRE_KEY);

            this.close();
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            on_press(keyElement);
            clearKeyboard();
            keyElement.style.background = "rgba(0, 0, 0, 0.8)";
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
