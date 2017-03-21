/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

// require
var Question = require("./question");
var Ajax = require("./ajax");
var Timer = require("./timer");
var Highscore = require("./highScore");

/**
 * Constructor Quiz, initalise the variables
 * @param user
 * @param URL
 * @constructor Quiz
 */
function Quiz(user, URL)
{
  this.username = user;
  this.timer = undefined;
  this.question = undefined;
  this.nextURL = URL ;
  this.button = undefined;
  this.form = undefined;
  this.totalTime = 0;

  //request the first question
  this.getQuestion();
}

/**
 * Function getQuestion ( prototype is used for inheritance )
 * @role  send a request for a new question
 */

Quiz.prototype.getQuestion = function()
{
  var config = {
    method: "GET",
    url: this.nextURL
  };
  var respFunction = this.response.bind(this); // create a copy of this function

  Ajax.GetHttpRequest(config, respFunction);
};

/**
 * Function response
 * @param error
 * @param resp
 * @role handle the response, used as an argument 'callback' for a request (ajax.js) .
 */
Quiz.prototype.response = function(error, resp)
{
  // 404 means no more questions
  if (error)
  {
    this.gameOver();
  }
  if (resp) // if there is a response
  {
    var obj = JSON.parse(resp);  //parse to JSON

    this.nextURL = obj.nextURL; // get the next URL

    if (obj.question) // if there is a question, we call a function to display the question
    {
      this.responseQuestion(obj);
    }
    else // else we check if it's a correct answer
    {
      if (this.nextURL || obj.message === "Correct answer!")
      {
        this.responseAnswer(obj);
      }
    }
  }

};

/**
 * Function responseQuestion
 * @param obj
 * @role display the question and a timer
 */
Quiz.prototype.responseQuestion = function(obj)
{
  var content = document.querySelector("#context");
  this.clearElement(content);

  this.question = new Question(obj); // new question with the data inside obj
  this.question.print(); // display the question

  this.timer = new Timer(this, document.querySelector(".timer p"), 20);   //create a new timer for question
  this.timer.start(); // start the timer

  this.addListener();
};


/**
 * Function responseAnswer
 * @param obj
 * @role check if the answer is correct, if there is no nextUrl then the game is completed
 */
Quiz.prototype.responseAnswer = function(obj)
{
  var content = document.querySelector("#context");
  this.clearElement(content);

  //Handle the template for answer
  var template = document.querySelector("#template_answer").content.cloneNode(true);
  var text = document.createTextNode(obj.message);
  template.querySelector("p").appendChild(text);

  content.appendChild(template);
  if (this.nextURL)
  {
    var newQuestion = this.getQuestion.bind(this);
    setTimeout(newQuestion, 500);
  }
  else // Game is finish
  {
    this.gameCompleted();
  }
};

/**
 * Function addListener
 * @role add listener for submit
 */
Quiz.prototype.addListener = function()
{
  this.button = document.querySelector(".submit");
  this.form = document.querySelector(".questionForm");

  this.button.addEventListener("click", this.submit.bind(this), true);
  this.form.addEventListener("keypress", this.submit.bind(this), true);
};

/**
 * Function submit
 * @param event
 * @role
 */
Quiz.prototype.submit = function(event)
{
  if (event.keyCode === 13 || event.type === "click") // if users click or press enter (keyCode === 13)
  {
    event.preventDefault();

    this.totalTime += this.timer.stop();
    var input;

    this.button.removeEventListener("click", this.submit.bind(this));     //avoid double-submit
    this.form.removeEventListener("keypress", this.submit.bind(this));

    //save input depending on the type of question
    if (document.querySelector("#answer")) // if it's a question with input text
    {
      input = document.querySelector("#answer").value;
    }
    else  //else its a question with radiobutton
    {
      input = document.querySelector("input[name='alternative']:checked").value;
    }

    var config = {     //set the config
      method: "POST",
      url: this.nextURL,
      data: {
        answer: input
      }
    };

    var respFunction = this.response.bind(this);
    Ajax.GetHttpRequest(config, respFunction);
  }
};


/**
 * Function gameOver
 * @param cause
 * @role Game is over (You lost)
 */
Quiz.prototype.gameOver = function(cause)
{
  var high_score = new Highscore("highScore", this.username);
  var title;

  this.clearElement(document.querySelector("#context"));

  var template = document.querySelector("#template_quiz_end").content.cloneNode(true); // call template

  var showScore = template.querySelector(".show_score");
  template.querySelector("div").removeChild(showScore);

  if (cause === "timesUP")
  {
    title = document.createTextNode("Time is over !");
  }
  else
  {
    title = document.createTextNode("Wrong answer!");
  }

  template.querySelector("h4").appendChild(title);

  if (high_score.highscore.length > 0)  // if there is already highscore
  {
    var hsFrag = high_score.createHighscore();
    template.querySelector("table").appendChild(hsFrag);
  }
  else
  {
    var label = document.createElement("label");
    label.appendChild(document.createTextNode("No highscore yet :("));
    template.querySelector("table").appendChild(label);
  }

  document.querySelector("#context").appendChild(template);

};

/**
 * Function gameCompleted
 * @role display information when the game is completed
 */
Quiz.prototype.gameCompleted = function()
{
  var high_score = new Highscore("highScore", this.username, this.totalTime.toFixed(3)); // toFixed used to display milliseconds
  var isNew = high_score.addToList(); // add new highScore to the list

  var template = document.querySelector("#template_quiz_end").content.cloneNode(true); // call template

  if (high_score.highscore.length > 0)  // if there is already highSocre
  {
    var hsFrag = high_score.createHighscore();
    template.querySelector("table").appendChild(hsFrag);
  }

  if (isNew) // if the time is better than the other 5 one
  {
    var title = document.createTextNode("New Score!");
    template.querySelector("h4").appendChild(title);
  }

  this.clearElement(document.querySelector("#context"));

  var h1 = template.querySelector(".time");
  var text = document.createTextNode(this.totalTime.toFixed(3));
  h1.appendChild(text);
  document.querySelector("#context").appendChild(template);

};

/**
 * Function clearElement
 * @param element
 * @role clear a specific element of childs
 */
Quiz.prototype.clearElement = function(element)
{
  while (element.hasChildNodes())
  {
    element.removeChild(element.lastChild);
  }
};

module.exports = Quiz;
