// created by reisarthur

// Variables:
var hits = 0;
var soundOn = true;

var timeLimit = 30;
var timePassed = 0;
var timeLeft = timeLimit;
var timerInterval = null;


// ===============
// Game Buttons:
// ===============

// Play/Pause Button:
$(".btn-play-pause").click(function() {
  if ($(this).hasClass("paused")) {
    resetTimer(timeLimit);
  } else {
    startTimer();
    $("#square-random").text(randomSquare);
  }
  $(this).toggleClass("paused");
});

// Click on Chessboard:
$(".chess-square").click(function() {
  var rndm = $("#square-random").text();
  var click = $(this).attr('id');
  $("#square-clicked").text(click);
  if (soundOn) {
    if (rndm === "-") {
      $("#img-answer-right").addClass("hidden");
      $("#img-answer-wrong").addClass("hidden");
    } else if (click === rndm) { //acertou!
      hits++;
      playSound("right");
      $("#square-random").text(randomSquare);
      $("#img-answer-right").removeClass("hidden");
      $("#img-answer-wrong").addClass("hidden");
    } else { //errou!
      resetTimer(0);
      playSound("wrong");
      $("#img-answer-right").addClass("hidden");
      $("#img-answer-wrong").removeClass("hidden");
    }
  }
});


// ===============
// Setting Buttons:
// ===============

// Set Timer:
$("#btn-timer").click(function() {
  var time = prompt("Set the time limit (in seconds):", "30");
  if (isInt(time)) {
    timeLimit = parseInt(time);
    resetTimer(timeLimit);
  }
});

// Display Square Names:
$("#btn-squarenames").click(function() {
  $(".notation").toggleClass('hidden');
  $(this).text(function(i, text) {
    return text === "Show square names" ? "Hide square names" : "Show square names";
  })
});

// Display Pieces:
$("#btn-pieces").click(function() {
  $(this).text(function(i, text) {
    if (text === "Hide pieces") {
      $(".chess-square").css('background-size', '0,0');
      return "Show pieces";
    } else {
      $(".chess-square").css('background-size', 'contain');
      return "Hide pieces";
    }
  })
});

// Play Sounds:
$("#btn-sounds").click(function() {
  $(this).text(function(i, text) {
    if (text === "Disable sounds") {
      soundOn = false;
      return "Enable sounds";
    } else {
      soundOn = true;
      return "Disable sounds";
    }
  })
});

// Reverse Chessboard:
$("#btn-reverse").click(function() {
  $(this).text(function(i, text) {
    if (text === "White on bottom") {
      $(".chess-board").css('flex-direction', 'column');
      $(".chess-row").css('flex-direction', 'row');
      return "Black on bottom";
    } else {
      $(".chess-board").css('flex-direction', 'column-reverse');
      $(".chess-row").css('flex-direction', 'row-reverse');
      return "White on bottom";
    }
  })
});



// ===============
// Aux Functions
// ===============

// Return a random square, e.g 'b3':
function randomSquare() {
  var randomNumber = Math.floor(Math.random() * 64);
  var col = Math.floor(randomNumber / 8);
  var row = randomNumber % 8 + 1;
  var square = String.fromCharCode(97 + col) + row;
  return square;
}

// Play sound:
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// Check if value is integer:
function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}



// ===============
// Timer Functions:
// ===============
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
var remainingPathColor = COLOR_CODES.info.color;

$("#timer").html(`
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`);

function onTimesUp() {
  $("#square-random").text("-");
  $("#square-score").text(hits);
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = timeLimit - timePassed;
    $("#base-timer-label").html(formatTime(timeLeft));
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const {
    alert,
    warning,
    info
  } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.info.color);
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.warning.color);
    $("#base-timer-path-remaining").addClass(COLOR_CODES.alert.color);
  } else if (timeLeft <= warning.threshold) {
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.info.color);
    $("#base-timer-path-remaining").addClass(COLOR_CODES.warning.color);
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.alert.color);
  } else {
    $("#base-timer-path-remaining").addClass(COLOR_CODES.info.color);
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.warning.color);
    $("#base-timer-path-remaining").removeClass(COLOR_CODES.alert.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function resetTimer(timeReset) {
  hits = 0;
  $("#square-random").text("-");
  $("#square-score").text("-");
  clearInterval(timerInterval);
  timePassed = 0;
  // timeLimit = timeReset;
  timeLeft = timeReset - timePassed;
  $("#base-timer-label").html(formatTime(timeLeft));
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
}
