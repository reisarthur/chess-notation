// created by reisarthur

// Variables:
var hits = 0;
var soundsOn = true;
var squarenames = true;
var pieces = true;
var reverse = true;

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
    playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3");
  } else {
    startTimer();
    playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-start.mp3");
    $("#square-random").text(randomSquare);
  }
  $(this).toggleClass("paused");
});

// Click on Chessboard:
$(".chess-square").click(function() {
  var rndm = $("#square-random").text();
  var click = $(this).attr('id');
  $("#square-clicked").text(click);
  if (soundsOn) {
    if (rndm === "-") {
      $("#img-answer-right").addClass("hidden");
      $("#img-answer-wrong").addClass("hidden");
    } else if (click === rndm) { //acertou!
      hits++;
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3");
      $("#square-random").text(randomSquare);
      $("#img-answer-right").removeClass("hidden");
      $("#img-answer-wrong").addClass("hidden");
    } else { //errou!
      resetTimer(0);
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3");
      $("#img-answer-right").addClass("hidden");
      $("#img-answer-wrong").removeClass("hidden");
    }
  }
});


// ===============
// Setting Buttons:
// ===============

// Set Timer:
$("#btn-timer").click(function () {
    //var time = prompt("Set the time limit (in seconds):", "30");
    var time = prompt(language.prompttimer, "30");
  if (isInt(time)) {
    timeLimit = parseInt(time);
    resetTimer(timeLimit);
  }
});

// Display Square Names:
$("#btn-squarenames").click(function() {
    $(".notation").toggleClass('hidden');
    if (squarenames) {
        squarenames = false;
        $(this).text(function (i, text) {
            return language.btnsquarenamesoff;
        })
    } else {
        squarenames = true;
        $(this).text(function (i, text) {
            return language.btnsquarenameson;
        })
    }
});

// Display Pieces:
$("#btn-pieces").click(function() {
    if (pieces) {
        pieces = false;
        $(this).text(function (i, text) {
            $(".chess-square").css('background-size', '0,0');
            return language.btnpiecesoff;
        })
    } else {
        pieces = true;
        $(this).text(function (i, text) {
            $(".chess-square").css('background-size', 'contain');
            return language.btnpieceson;
        })
    }
});

// Play Sounds:
$("#btn-sounds").click(function() {
    if (soundsOn) {
        soundsOn = false;
        $(this).text(function (i, text) {
            return language.btnsoundsoff;
        })
    } else {
        soundsOn = true;
        $(this).text(function (i, text) {
            return language.btnsoundson;
        })
    }
});

// Reverse Chessboard:
$("#btn-reverse").click(function() {
    if (reverse) {
        reverse = false;
        $(".chess-board").css('flex-direction', 'column-reverse');
        $(".chess-row").css('flex-direction', 'row-reverse');
        $(this).text(function (i, text) {
            return language.btnreverseoff;
        })
    } else {
        reverse = true;
        $(".chess-board").css('flex-direction', 'column');
        $(".chess-row").css('flex-direction', 'row');
        $(this).text(function (i, text) {
            return language.btnreverseon;
        })
    }
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
  var audio = new Audio(name);
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
    if (timeLeft === 10) {
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/tenseconds.mp3");
    }
    if (timeLeft === 0) {
      playSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3");
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


//Language Selection:
var pt = {
    "title": "Treino de Notações de Xadrez",
    "description1": "A Notação Algébrica é o método padrão de registrar e descrever os movimentos de um jogo de xadrez.",
    "btnwiki": "Artigo na Wikipedia",
    "wikilink": "https://pt.wikipedia.org/wiki/Nota%C3%A7%C3%A3o_alg%C3%A9brica_de_xadrez",
    "subtitle": "Nomeando as Casas",
    "description2": "<p>Cada casa do tabuleiro de xadrez é identificada por um par de coordenadas único. Pelo ponto de vista das peças brancas:</p><ul><li>Linhas são nomeadas <em>1</em> até <em>8</em> de baixo para cima.</li><li>Colunas são nomeadas <em>a</em> até <em>h</em> da esquerda para a direita.</li></ul><p>Encontre corretamente o máximo número de casas antes que o tempo acabe e <b>se torne um jogador profissional de xadrez</b>.</p>",
    "next": "Próximo:",
    "clicked": "Clicado:",
    "score": "Pontuação:",
    "settings": "Configurações:",
    "btnsquarenameson": "Esconder nome das casas",
    "btnsquarenamesoff": "Mostrar nome das casas",
    "btnreverseon": "Pretas embaixo",
    "btnreverseoff": "Brancas embaixo",
    "btnsoundson": "Desligar sons",
    "btnsoundsoff": "Ligar sons",
    "btntimer": "Alterar tempo",
    "btnpieceson": "Esconder peças",
    "btnpiecesoff": "Mostrar peças",
    "prompttimer": "Alterar limite de tempo (em segundos):",
    "footer1": "Espero que curta! Compartilhe com seus parceiros.",
    "footer2": "Criado por <a href=\"https://reisarthur.github.io/cv/\" target=\"blank\">reisarthur</a> ♔, 2021."
};
var en = {
    "title": "Chess Notation Training",
    "description1": "The Algebraic Notation is the standard method for recording and describing moves in a game of chess.",
    "btnwiki": "Wikipedia Article",
    "wikilink": "https://en.wikipedia.org/wiki/Algebraic_notation_(chess)",
    "subtitle": "Naming the Squares",
    "description2": "<p>Each chessboard square is identified by a unique coordinate pair, from the White's point of view:</p><ul><li> Rows are named <em>1</em> to <em>8</em> from bottom to top.</li><li>Columns are named <em>a</em> to <em>h</em> from left to right.</li></ul><p>Find correctly the max number of squares before the time runs out and <b>become a pro</b> chess player.</p>",
    "next": "Next:",
    "clicked": "Clicked:",
    "score": "Score:",
    "settings": "Settings:",
    "btnsquarenameson": "Hide square names",
    "btnsquarenamesoff": "Show square names",
    "btnreverseon": "Black on bottom",
    "btnreverseoff": "White on bottom",
    "btnsoundson": "Disable sounds",
    "btnsoundsoff": "Enable sounds",
    "btntimer": "Set time limit",
    "btnpieceson": "Hide pieces",
    "btnpiecesoff": "Show pieces",
    "prompttimer": "Set the time limit (in seconds):",
    "footer1": "Hope you enjoy! Share with your fellows.",
    "footer2": "Created by <a href=\"https://reisarthur.github.io/cv/\" target=\"blank\">reisarthur</a> ♔, 2021."
}
var language = pt;

function setLanguage(lang) {
    switch (lang) {
        case 'en':
            language = en;
            break;
        case 'pt':
            language = pt;
            break;
    }
    $(document).ready(function () {
        $('#title').text(language.title);
        $('#btn-wiki').text(language.btnwiki);
        $('#btn-wiki').attr("href", language.wikilink);
        $('#subtitle').text(language.subtitle);
        $('#description1').text(language.description1);
        $('#description2').html(language.description2);
        $('#next').text(language.next);
        $('#clicked').text(language.clicked);
        $('#score').text(language.score);
        $('#settings').text(language.settings);
        if (squarenames) $('#btn-squarenames').text(language.btnsquarenameson);
        else $('#btn-squarenames').text(language.btnsquarenamesoff);
        if (reverse) $('#btn-reverse').text(language.btnreverseon);
        else $('#btn-reverse').text(language.btnreverseoff);
        if (soundsOn) $('#btn-sounds').text(language.btnsoundson);
        else $('#btn-sounds').text(language.btnsoundsoff);
        $('#btn-timer').text(language.btntimer);
        if (pieces) $('#btn-pieces').text(language.btnpieceson);
        else $('#btn-pieces').text(language.btnpiecesoff);
        $('#footer1').html(language.footer1);
        $('#footer2').html(language.footer2);
    });
}

setLanguage('pt');