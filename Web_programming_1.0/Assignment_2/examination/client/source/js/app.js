/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

// Call quiz.js
var Quiz = require("./quiz");

/**
 * Function submit
 * @role when button submit is pressed, start the quizz if the username if fill.
 * @param event
 */
function submit(event)
{
  if (event.keyCode === 13 || event.type === "click") // if users click or press enter (keyCode === 13)
  {
    event.preventDefault(); // cancel the event without stop the propagation

    // get the username
    var input = document.querySelector("#username").value;

    if (input.length > 1 ) //if username written
    {
      //start the quiz with the first question
      q = new Quiz(input, "http://vhost3.lnu.se:20080/question/1");
    }
  }
}

/**
 * Function addListener
 * @role add Listener
 */
function addListener()
{
  var button = document.querySelector("#submitUsername");
  var form = document.querySelector("#formUsername");

  button.addEventListener("click", submit, true);
  form.addEventListener("keypress", submit, true);
}

addListener();
