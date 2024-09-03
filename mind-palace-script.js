"use strict";
console.log(`link: OK`);
/*
legend:
❗ - sections or notable lines. two denote a new section
⚠️ - warnings; pay close attention
🤬 - more difficult than anticipated; roughly the number of times i commented '// this is buggy' and had to work through & find a fix before proceeding
*/

// ❗❗ starting variables - always initialize with exact same name as IDs or classes in html so easier to track 🤬

// 1️⃣ navbar button
const buttonToggleTooltips = document.getElementById("buttonToggleTooltips");

// 2️⃣ build section
const userInputHall = document.getElementById("userInputHall");
const userInputRoom = document.getElementById("userInputRoom");
const inputRoomCounter = document.getElementById("inputRoomCounter");
const userInputDoor = document.getElementById("userInputDoor");
const buildButton = document.getElementById("buildButton");

// 3️⃣ tooltips
const step1Tutorial = document.getElementById("step1Tutorial");
const step2Tutorial = document.getElementById("step2Tutorial");
const step3Tutorial = document.getElementById("step3Tutorial");
const step4Tutorial = document.getElementById("step4Tutorial");
const findTutorial = document.getElementById("findTutorial");

// 4️⃣ pre-commit preview
const hallPreviewDisplay = document.getElementById("hallPreviewDisplay");
const doorPreviewDisplay = document.getElementById("doorPreviewDisplay");

// 5️⃣ find section
const userInputFind = document.getElementById("userInputFind");
const findButton = document.getElementById("findButton");

// 6️⃣ return section
const userReturnContainer = document.getElementById("userReturnContainer");
const outputHall = document.getElementById("outputHall");
const outputHallRooms = document.getElementById("outputHallRooms");

// 7️⃣ return rooms section
const doorPlate = document.querySelectorAll(".doorPlate");
const doorEnter = document.getElementById("doorEnter");
const roomContainers = document.querySelectorAll(".roomContainer");
const roomContent = document.querySelectorAll(".roomContent");

// ⚠️ mind palace object - DO NOT TOUCH
const mindPalace = {};

// ❗❗ input functions

// 1️⃣ checking input: hall 🤬

function checkInputHall() {
  const verifyBox = userInputHall.value.trim().toLowerCase(); // ensure lowercase
  const regex = /^[\p{L}]+$/u; // regex for letters only, including non-English letters
  userInputHall.setCustomValidity(``); // clears the custom error tip on click

  if (!regex.test(verifyBox)) {
    userInputHall.setCustomValidity(
      `one word, just letters; no numbers, spaces, or special symbols`
    ); // custom error tip
    userInputHall.reportValidity();
    return false; // stops function if check fail
  }

  let validHall = `>${verifyBox}`;
  return validHall; // forces return of >prefixed OK hall name to differentiate from door names, in case user submits similar hall-door combinations
}

// 2️⃣ checking input: hall uniqueness, add or update hall 🤬

function addHall(validHall) {
  let isExistingHall = false; // sets up check for whether input hall is unique

  if (mindPalace[validHall]) {
    isExistingHall = true; // flags hall as not unique, changes behaviour of preview to advise user new room will be added to an existing hall, instead of building out a new one
  } else {
    mindPalace[validHall] = {}; // builds new hall otherwise 🤬
  }

  // returns hall key & whether extant
  return { hallKey: validHall, isExistingHall: isExistingHall };
}

// 3️⃣ checking input: room - adds dynamic counter below room input for char limit

const maxRoomLength = 500;

userInputRoom.addEventListener("input", function () {
  const currentLength = userInputRoom.value.length;
  inputRoomCounter.textContent = `${currentLength}/${maxRoomLength}`;
});

// 4️⃣ checking input: door

function checkInputDoor() {
  const validDoor = userInputDoor.value.trim().toLowerCase(); // ensure lowercase
  const regex = /^[\p{L}]+$/u; // regex for letters only
  userInputDoor.setCustomValidity(""); // clears the custom error tip on click

  if (!regex.test(validDoor)) {
    userInputDoor.setCustomValidity(
      `one word, just letters; no numbers, spaces, or special symbols`
    ); // custom error tip
    userInputDoor.reportValidity();
    return false; // stops function if check fail
  }

  return validDoor; // returns OK door name, without prefix unlike hall name to differentiate halls from doors in case user submits similar hall-door name pairs
}

// 5️⃣ add door, add room as a property of its door 🤬

// check for empty inputs on submit
buildButton.addEventListener("click", function (e) {
  e.preventDefault(); // prevent page refresh

  const validHall = checkInputHall();
  if (!validHall) return; // exit if hall input is invalid

  const checkedHall = addHall(validHall); // this calls the hall checker

  // unpacks the paired result of the dual checks of, 'is this a valid character string?', and 'does this hall already exist?' for use down the line 🤬🤬🤬🤬
  const hallKey = checkedHall.hallKey;
  const isExistingHall = checkedHall.isExistingHall;

  // cleans up the checked room, sticks content into a variable to let us store it as a property of its respective door
  const roomContent = userInputRoom.value.trim();

  // grabs validated door name
  const validDoor = checkInputDoor();
  if (!validDoor) return; // exit if door input is invalid

  // store the door using its actual name as the key
  mindPalace[hallKey][validDoor] = {
    room: roomContent,
  };

  // updates preview text under the .build(); button
  hallPreviewDisplay.textContent = hallKey;
  if (isExistingHall) {
    hallPreviewDisplay.textContent += ` - already exists, so this room will be added to it.`; // advises hall exists, will add current room to it
  }
  doorPreviewDisplay.textContent = validDoor;
});

// ❗❗tooltip behaviour functions

// all start visible
let tooltipsHidden = false;
let buildButtonClicked = false;

// 1️⃣ fade out animation

function fadeOut(e) {
  e.style.transition = "opacity 0.5s, transform 0.5s";
  e.style.opacity = "0";
  e.style.transform = "translateY(-10px)";
  setTimeout(() => {
    e.style.display = "none";
  }, 500); // finish transition before fully hidden
}

// 2️⃣ fade in animation

function fadeIn(e) {
  e.style.display = "block";
  setTimeout(() => {
    e.style.transition = "opacity 0.5s, transform 0.5s";
    e.style.opacity = "1";
    e.style.transform = "translateY(0)";
  }, 10); // delay to set display before transition
}

// 3️⃣ build(); tooltips handler 🤬🤬🤬🤬🤬

function hideBuildTooltips() {
  if (!buildButtonClicked) {
    fadeOut(step1Tutorial);
    fadeOut(step2Tutorial);
    fadeOut(step3Tutorial);
    fadeOut(step4Tutorial);
    buildButtonClicked = true;
  }
}

// 4️⃣ button event listeners

// build();
buildButton.addEventListener("click", function () {
  hideBuildTooltips();
});

// find();
findButton.addEventListener("click", function () {
  fadeOut(findTutorial);
});

// 5️⃣ toggle tooltips button

buttonToggleTooltips.addEventListener("click", function () {
  const tooltips = [
    step1Tutorial,
    step2Tutorial,
    step3Tutorial,
    step4Tutorial,
    findTutorial,
  ];

  // ❗ the toggle button will grab all tooltips, from build(); steps 1 through 4 and the find(); tooltip - the toggle button should override normal behaviour

  // checks arrayed tooltips when clicked if they're already hidden or not, and executes the opposite animation
  if (!tooltipsHidden) {
    tooltips.forEach(fadeOut);
    tooltipsHidden = true;
  } else {
    tooltips.forEach(fadeIn);
    tooltipsHidden = false;
  }
});

// ❗❗search & return functions

findButton.addEventListener("click", function (e) {
  e.preventDefault(); // prevent page refresh

  const userInput = userInputFind.value.trim().toLowerCase(); // Ensure input is lowercase

  // 1️⃣ check for starting '>'
  if (!userInput.startsWith(">")) {
    userInputFind.setCustomValidity(`begin with >`); // custom error tip
    userInputFind.reportValidity();
    return;
  } else {
    userInputFind.setCustomValidity(``); // clears error message
  }

  // clears return box
  outputHall.textContent = ``;
  outputHallRooms.innerHTML = ``;

  // 2️⃣ for >all - includes a loop where it grabs all validated and stored hall names & lists them onto the display
  if (userInput === `>all`) {
    const allHalls = Object.keys(mindPalace).sort();
    outputHall.textContent = `all halls within:`;
    // here's the loop - ⚠️ may get potentially chunky if user ends up with a ton of valid halls
    allHalls.forEach((hall) => {
      const hallItem = document.createElement("li");
      hallItem.textContent = hall;
      outputHallRooms.appendChild(hallItem);
    });
    userReturnContainer.style.display = "block";
    return;
  }

  // 3️⃣ grab the hall and door names, starting with taking the user's search query and...
  const inputParts = userInput.slice(1).split("-"); // cuts it up into two bits...
  const hallName = inputParts[0]; // grabs the first bit and checks if it's a valid hall name
  const doorName = inputParts[1]; // grabs the second bit and checks if it's a valid door name
  const fullHallName = `>${hallName}`; // ... and restores the > for the hall name since it's an important distinction from possible similar door names

  if (mindPalace[fullHallName]) {
    if (!doorName) {
      // if user query includes valid hall name and nothing else:
      outputHall.textContent = `doors within ${hallName}:`; // lists all valid doors in that hall
      Object.keys(mindPalace[fullHallName]).forEach((doorKey) => {
        const doorItem = document.createElement("li"); // creates a list 🤬 - ⚠️ another potentially chunky step
        doorItem.textContent = `${hallName}-${doorKey}`; // formats the display to keep consistent with query requirements

        // creates individual 'enter room' buttons for each valid door listing under a hall array
        const enterButton = document.createElement("button");
        enterButton.textContent = `enter room`;
        enterButton.addEventListener("click", function () {
          displayRoom(fullHallName, doorKey); // which, from here, the user can use to enter the room
        });
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend & /append - this was a nightmare 🤬 x infinity
        doorItem.prepend(enterButton);
        outputHallRooms.append(doorItem);
      });
      userReturnContainer.style.display = "block";
      return;
    }

    // 4️⃣ complete >hall-door combination
    if (mindPalace[fullHallName][doorName]) {
      // display the full room content
      displayRoom(fullHallName, doorName);
    }
    // if invalid hall-door combination, display error
    else {
      userInputFind.setCustomValidity(`well, now.`); //placeholder, shouldn't even be happening since it's been validated a bunch
      userInputFind.reportValidity();
    }
  }
  // if invalid hall name, display error
  else {
    userInputFind.setCustomValidity(`well, now.`); //placeholder, shouldn't even be happening since it's been validated a bunch
    userInputFind.reportValidity();
  }
});

// Function to display the full room content
function displayRoom(hallName, doorKey) {
  const roomContent = mindPalace[hallName][doorKey].room;
  outputHall.textContent = `${hallName}-${doorKey}:`;

  const roomItem = document.createElement("p");
  roomItem.textContent = roomContent;

  outputHallRooms.innerHTML = ``; // clear previous results
  outputHallRooms.appendChild(roomItem);

  userReturnContainer.style.display = "block"; // show the results
}

// -- a
