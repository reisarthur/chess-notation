$("#square-random").click(function () {
    $("#square-random").text(randomSquare);
});

$(".chess-square").click(function () {
    $("#square-clicked").text($(this).attr('id'));
});

$("#btn-squarenames").click(function () {
    $(".notation").toggleClass('hidden');
    $(this).text(function(i, text){
          return text === "Show square names" ? "Hide square names" : "Show square names";
      })
});

$("#btn-pieces").click(function () {
  $(this).text(function(i, text){
    if (text === "Hide pieces") {
      $(".chess-square").css('background-size','0,0');
      return "Show pieces";
    } else {
      $(".chess-square").css('background-size','contain');
      return "Hide pieces";
    }
  })
});

$("#btn-reverse").click(function () {
  $(this).text(function(i, text){
    if (text === "White on bottom") {
      $(".chess-board").css('flex-direction','column');
      $(".chess-row").css('flex-direction','row');
      return "Black on bottom";
    } else {
      $(".chess-board").css('flex-direction','column-reverse');
      $(".chess-row").css('flex-direction','row-reverse');
      return "White on bottom";
    }
  })
});

function randomSquare() {
  var randomNumber = Math.floor(Math.random() * 64);
  var col = Math.floor(randomNumber / 8);
  var row = randomNumber % 8 + 1;
  var square = String.fromCharCode(97 + col) + row;
  return square;
}
