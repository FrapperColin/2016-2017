(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */


/**
 * Function GetHttpRequest
 * @param config
 * @param callback
 */
function GetHttpRequest(config, callback)
{
  var r = new XMLHttpRequest();

  //add eventlistener for response
  r.addEventListener("load", function()
  {

    if (r.status >= 400)
    {
      //got error, call with errorcode
      callback(r.status);
    }

    //call the callback function with responseText
    callback(null, r.responseText);
  });

  //open a request from the config
  r.open(config.method, config.url);

  if (config.data)
  {
    //send the data as JSON to the server
    r.setRequestHeader("Content-Type", "application/json");
    r.send(JSON.stringify(config.data));
  }
  else  //send request
  {
    r.send(null);
  }
}

module.exports.GetHttpRequest = GetHttpRequest;

},{}],2:[function(require,module,exports){
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

},{"./quiz":5}],3:[function(require,module,exports){
/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

/**
 * Constructor Highscore
 * @param local
 * @param user
 * @param score
 * @constructor HighScore
 */
function Highscore(local, user, score)
{
  this.username = user;
  this.score = score;
  this.local = local;
  this.highscore = [];

  this.readFromFile(); // read HighScore
}

/**
 * Function readFromFile
 * @role push username in Storage
 */
Highscore.prototype.readFromFile = function()
{
  //localStorage.clear(); // if we want clear storage
  var hsFile = localStorage.getItem(this.local);
  if (hsFile) // if there is something in localStorage
  {
    var json = JSON.parse(hsFile); // parse

    for (var username in json)
    {
      if (json.hasOwnProperty(username)) // if Json-file(storage) has a property named username
      {
        this.highscore.push(json[username]);
      }
    }
  }
};

/**
 * Function isHighscore
 * @returns {boolean}
 * @role add the score if there is not 5 score in the list or if the score is better than the last highscore
 */
Highscore.prototype.isHighscore = function()
{
  var isHighScore = false;
  if (this.highscore.length === 0) // if there is no highscore
  {
    isHighScore = true;
  }
  else
  {
    var lastScore = this.highscore[this.highscore.length - 1].score; // the last score

    if (parseFloat(this.score) < parseFloat(lastScore) || this.highscore.length < 5) // if this scrore is better than the last one or if there is no 5 highscores in the storage
    {
      isHighScore = true;
    }
  }
  return isHighScore;
};

/**
 * Function addToList
 * @returns {boolean}
 * @role add to the list the score if he sould be added
 *
 */
Highscore.prototype.addToList = function()
{
  var added = false;

  if (this.isHighscore()) // if the score should be added
  {
    var thisScore = {   // save username and score
      username: this.username,
      score: this.score,
    };

    if (this.highscore.length === 5) // if there is already five highscore in the localStorage
    {
      this.highscore.splice(-1, 1); // If the first param is negative, will begin that many elements from the end.
    }

    this.highscore.push(thisScore);
    this.highscore = this.highscore.sort(function(a, b) // sort the array
    {
      return a.score - b.score;
    });

    this.saveToFile(); // save the data
    added = true;
  }
  return added;
};

/**
 * Function saveToFile
 * @role save the data
 */
Highscore.prototype.saveToFile = function()
{
  localStorage.setItem(this.local, JSON.stringify(this.highscore));
};

/**
 * Function createHighscore
 * @returns {DocumentFragment}
 */
Highscore.prototype.createHighscore = function()
{
  var frag = document.createDocumentFragment();
  var template;
  var hsUsername;
  var hsScore;

  for (var i = 0; i < this.highscore.length; i++)
  {
    template = document.querySelector("#template_highscore_row").content.cloneNode(true); // call template
    hsUsername = template.querySelector(".hs_username");
    hsScore = template.querySelector(".hs_score");
    hsUsername.appendChild(document.createTextNode(this.highscore[i].username));
    hsScore.appendChild(document.createTextNode(this.highscore[i].score + "  seconds"));
    frag.appendChild(template);
  }
  return frag;
};

module.exports = Highscore;


},{}],4:[function(require,module,exports){
/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

/**
 * Constructor Question
 * @param obj
 * @constructor
 */
function Question(obj)
{
  this.id = obj.id;
  this.question = obj.question;
  this.alt = obj.alternatives;
}

/**
 * Function print
 * @role call function to display question
 */
Question.prototype.print = function()
{
  if (this.alt) // if the question use alternative response
  {
    this.printAltQuestion();
  }
  else // classic question
  {
    this.printQuestion();
  }
  document.querySelector("input").focus(); // so we can use keyboard

};

/**
 * Function clearElement
 * @param element
 * @role clear lastchild of the element passed in parameter
 */
Question.prototype.clearElement = function(element)
{
  while (element.hasChildNodes())
  {
    element.removeChild(element.lastChild);
  }
};

/**
 * Function printAltQuestion
 * @role print checkbox to the page
 */
Question.prototype.printAltQuestion = function()
{
  var template = document.querySelector("#template_question_alt").content.cloneNode(true); // call template
  template.querySelector(".questionHead").appendChild(document.createTextNode("Question : " + this.question));

  var inputFrag = this.getAltFrag(); // get the fragment for alternatives
  template.querySelector(".questionForm").insertBefore(inputFrag, template.querySelector(".submit")); // insere checkbox before submit
  document.querySelector("#context").appendChild(template);
};


/**
 * Function getAltFrag
 * @returns {DocumentFragment}
 * @role return the fragment for alternatives (checkbox in this case)
 */
Question.prototype.getAltFrag = function()
{
  var inputFrag = document.createDocumentFragment();
  var input;
  var label;
  var first = true;

  for (var alt in this.alt) // for each alt for the question
  {
    if (this.alt.hasOwnProperty(alt))// if Json-file(storage) has a property named alt
    {
      input = document.querySelector("#template_alternative").content.cloneNode(true); //call template
      if (first) // if the checkbox is "clicked"
      {
        input.querySelector("input").setAttribute("checked", "checked");
        first = false;
      }
      input.querySelector("input").setAttribute("value", alt);
      label = input.querySelector("label");
      label.appendChild(document.createTextNode(this.alt[alt])); // create a text node with the "named of alt"

      inputFrag.appendChild(input);
    }
  }
  return inputFrag;
};


/**
 * Function printQuestion
 * @role displat the question
 */
Question.prototype.printQuestion = function()
{
  var template = document.querySelector("#template_question").content.cloneNode(true); // call template
  template.querySelector(".questionHead").appendChild(document.createTextNode("Question : " + this.question));
  document.querySelector("#context").appendChild(template);
  document.querySelector("input").focus();
};

module.exports = Question;

},{}],5:[function(require,module,exports){
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

},{"./ajax":1,"./highScore":3,"./question":4,"./timer":6}],6:[function(require,module,exports){
/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

/**
 * Constructor Timer
 * @param content
 * @param element
 * @param time
 * @constructor Timer
 */
function Timer(content, element, time)
{
  this.time = time;
  this.element = element;
  this.content = content;
  this.startTime = new Date().getTime();
  this.interval = undefined;
}

/**
 * Function start
 * @role starts an interval for the timer
 */
Timer.prototype.start = function()
{
  this.interval = setInterval(this.run.bind(this), 100);
};

/**
 * Function run
 * @role
 */
Timer.prototype.run = function()
{
  var atm = new Date().getTime();

  var diff = (atm - this.startTime) / 1000; //difference from start to at the moment (atm)

  var showTime = this.time - diff;  // show countdown

  if (diff >= this.time)
  {
    showTime = 0;
    clearInterval(this.interval);
    this.content.gameOver("timesUP"); // Times up
  }
  if (showTime <= 10) // show decimals if under 10 seconds
  {
    this.element.classList.add("color"); // display red Timer
    this.print("Time left : " + showTime.toFixed(1));
  }
  else
  {
    this.print("Time left : " + showTime.toFixed(0));
  }
};

/**
 * Function stop
 * @returns {number}, difference in seconds
 * @role stop the timer
 */
Timer.prototype.stop = function()
{
  clearInterval(this.interval);
  var now = new Date().getTime();
  return (now - this.startTime) / 1000;
};

/**
 * Function print
 * @param diff
 * @role replace
 */
Timer.prototype.print = function(diff)
{
  this.element.replaceChild(document.createTextNode(diff), this.element.firstChild);
};

module.exports = Timer;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuNy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9oaWdoU2NvcmUuanMiLCJjbGllbnQvc291cmNlL2pzL3F1ZXN0aW9uLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9xdWl6LmpzIiwiY2xpZW50L3NvdXJjZS9qcy90aW1lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRlJBUFBFUlxuICogRGF0ZSA6IDI2LzA5LzIwMTZcbiAqL1xuXG5cbi8qKlxuICogRnVuY3Rpb24gR2V0SHR0cFJlcXVlc3RcbiAqIEBwYXJhbSBjb25maWdcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBHZXRIdHRwUmVxdWVzdChjb25maWcsIGNhbGxiYWNrKVxue1xuICB2YXIgciA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIC8vYWRkIGV2ZW50bGlzdGVuZXIgZm9yIHJlc3BvbnNlXG4gIHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKVxuICB7XG5cbiAgICBpZiAoci5zdGF0dXMgPj0gNDAwKVxuICAgIHtcbiAgICAgIC8vZ290IGVycm9yLCBjYWxsIHdpdGggZXJyb3Jjb2RlXG4gICAgICBjYWxsYmFjayhyLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgLy9jYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIHJlc3BvbnNlVGV4dFxuICAgIGNhbGxiYWNrKG51bGwsIHIucmVzcG9uc2VUZXh0KTtcbiAgfSk7XG5cbiAgLy9vcGVuIGEgcmVxdWVzdCBmcm9tIHRoZSBjb25maWdcbiAgci5vcGVuKGNvbmZpZy5tZXRob2QsIGNvbmZpZy51cmwpO1xuXG4gIGlmIChjb25maWcuZGF0YSlcbiAge1xuICAgIC8vc2VuZCB0aGUgZGF0YSBhcyBKU09OIHRvIHRoZSBzZXJ2ZXJcbiAgICByLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIHIuc2VuZChKU09OLnN0cmluZ2lmeShjb25maWcuZGF0YSkpO1xuICB9XG4gIGVsc2UgIC8vc2VuZCByZXF1ZXN0XG4gIHtcbiAgICByLnNlbmQobnVsbCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuR2V0SHR0cFJlcXVlc3QgPSBHZXRIdHRwUmVxdWVzdDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBDb2xpbiBGUkFQUEVSXG4gKiBEYXRlIDogMjYvMDkvMjAxNlxuICovXG5cbi8vIENhbGwgcXVpei5qc1xudmFyIFF1aXogPSByZXF1aXJlKFwiLi9xdWl6XCIpO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHN1Ym1pdFxuICogQHJvbGUgd2hlbiBidXR0b24gc3VibWl0IGlzIHByZXNzZWQsIHN0YXJ0IHRoZSBxdWl6eiBpZiB0aGUgdXNlcm5hbWUgaWYgZmlsbC5cbiAqIEBwYXJhbSBldmVudFxuICovXG5mdW5jdGlvbiBzdWJtaXQoZXZlbnQpXG57XG4gIGlmIChldmVudC5rZXlDb2RlID09PSAxMyB8fCBldmVudC50eXBlID09PSBcImNsaWNrXCIpIC8vIGlmIHVzZXJzIGNsaWNrIG9yIHByZXNzIGVudGVyIChrZXlDb2RlID09PSAxMylcbiAge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIGNhbmNlbCB0aGUgZXZlbnQgd2l0aG91dCBzdG9wIHRoZSBwcm9wYWdhdGlvblxuXG4gICAgLy8gZ2V0IHRoZSB1c2VybmFtZVxuICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXNlcm5hbWVcIikudmFsdWU7XG5cbiAgICBpZiAoaW5wdXQubGVuZ3RoID4gMSApIC8vaWYgdXNlcm5hbWUgd3JpdHRlblxuICAgIHtcbiAgICAgIC8vc3RhcnQgdGhlIHF1aXogd2l0aCB0aGUgZmlyc3QgcXVlc3Rpb25cbiAgICAgIHEgPSBuZXcgUXVpeihpbnB1dCwgXCJodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xXCIpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIGFkZExpc3RlbmVyXG4gKiBAcm9sZSBhZGQgTGlzdGVuZXJcbiAqL1xuZnVuY3Rpb24gYWRkTGlzdGVuZXIoKVxue1xuICB2YXIgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdWJtaXRVc2VybmFtZVwiKTtcbiAgdmFyIGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1Vc2VybmFtZVwiKTtcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN1Ym1pdCwgdHJ1ZSk7XG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIHN1Ym1pdCwgdHJ1ZSk7XG59XG5cbmFkZExpc3RlbmVyKCk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRlJBUFBFUlxuICogRGF0ZSA6IDI2LzA5LzIwMTZcbiAqL1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIEhpZ2hzY29yZVxuICogQHBhcmFtIGxvY2FsXG4gKiBAcGFyYW0gdXNlclxuICogQHBhcmFtIHNjb3JlXG4gKiBAY29uc3RydWN0b3IgSGlnaFNjb3JlXG4gKi9cbmZ1bmN0aW9uIEhpZ2hzY29yZShsb2NhbCwgdXNlciwgc2NvcmUpXG57XG4gIHRoaXMudXNlcm5hbWUgPSB1c2VyO1xuICB0aGlzLnNjb3JlID0gc2NvcmU7XG4gIHRoaXMubG9jYWwgPSBsb2NhbDtcbiAgdGhpcy5oaWdoc2NvcmUgPSBbXTtcblxuICB0aGlzLnJlYWRGcm9tRmlsZSgpOyAvLyByZWFkIEhpZ2hTY29yZVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHJlYWRGcm9tRmlsZVxuICogQHJvbGUgcHVzaCB1c2VybmFtZSBpbiBTdG9yYWdlXG4gKi9cbkhpZ2hzY29yZS5wcm90b3R5cGUucmVhZEZyb21GaWxlID0gZnVuY3Rpb24oKVxue1xuICAvL2xvY2FsU3RvcmFnZS5jbGVhcigpOyAvLyBpZiB3ZSB3YW50IGNsZWFyIHN0b3JhZ2VcbiAgdmFyIGhzRmlsZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWwpO1xuICBpZiAoaHNGaWxlKSAvLyBpZiB0aGVyZSBpcyBzb21ldGhpbmcgaW4gbG9jYWxTdG9yYWdlXG4gIHtcbiAgICB2YXIganNvbiA9IEpTT04ucGFyc2UoaHNGaWxlKTsgLy8gcGFyc2VcblxuICAgIGZvciAodmFyIHVzZXJuYW1lIGluIGpzb24pXG4gICAge1xuICAgICAgaWYgKGpzb24uaGFzT3duUHJvcGVydHkodXNlcm5hbWUpKSAvLyBpZiBKc29uLWZpbGUoc3RvcmFnZSkgaGFzIGEgcHJvcGVydHkgbmFtZWQgdXNlcm5hbWVcbiAgICAgIHtcbiAgICAgICAgdGhpcy5oaWdoc2NvcmUucHVzaChqc29uW3VzZXJuYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIGlzSGlnaHNjb3JlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEByb2xlIGFkZCB0aGUgc2NvcmUgaWYgdGhlcmUgaXMgbm90IDUgc2NvcmUgaW4gdGhlIGxpc3Qgb3IgaWYgdGhlIHNjb3JlIGlzIGJldHRlciB0aGFuIHRoZSBsYXN0IGhpZ2hzY29yZVxuICovXG5IaWdoc2NvcmUucHJvdG90eXBlLmlzSGlnaHNjb3JlID0gZnVuY3Rpb24oKVxue1xuICB2YXIgaXNIaWdoU2NvcmUgPSBmYWxzZTtcbiAgaWYgKHRoaXMuaGlnaHNjb3JlLmxlbmd0aCA9PT0gMCkgLy8gaWYgdGhlcmUgaXMgbm8gaGlnaHNjb3JlXG4gIHtcbiAgICBpc0hpZ2hTY29yZSA9IHRydWU7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdmFyIGxhc3RTY29yZSA9IHRoaXMuaGlnaHNjb3JlW3RoaXMuaGlnaHNjb3JlLmxlbmd0aCAtIDFdLnNjb3JlOyAvLyB0aGUgbGFzdCBzY29yZVxuXG4gICAgaWYgKHBhcnNlRmxvYXQodGhpcy5zY29yZSkgPCBwYXJzZUZsb2F0KGxhc3RTY29yZSkgfHwgdGhpcy5oaWdoc2NvcmUubGVuZ3RoIDwgNSkgLy8gaWYgdGhpcyBzY3JvcmUgaXMgYmV0dGVyIHRoYW4gdGhlIGxhc3Qgb25lIG9yIGlmIHRoZXJlIGlzIG5vIDUgaGlnaHNjb3JlcyBpbiB0aGUgc3RvcmFnZVxuICAgIHtcbiAgICAgIGlzSGlnaFNjb3JlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzSGlnaFNjb3JlO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiBhZGRUb0xpc3RcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHJvbGUgYWRkIHRvIHRoZSBsaXN0IHRoZSBzY29yZSBpZiBoZSBzb3VsZCBiZSBhZGRlZFxuICpcbiAqL1xuSGlnaHNjb3JlLnByb3RvdHlwZS5hZGRUb0xpc3QgPSBmdW5jdGlvbigpXG57XG4gIHZhciBhZGRlZCA9IGZhbHNlO1xuXG4gIGlmICh0aGlzLmlzSGlnaHNjb3JlKCkpIC8vIGlmIHRoZSBzY29yZSBzaG91bGQgYmUgYWRkZWRcbiAge1xuICAgIHZhciB0aGlzU2NvcmUgPSB7ICAgLy8gc2F2ZSB1c2VybmFtZSBhbmQgc2NvcmVcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgc2NvcmU6IHRoaXMuc2NvcmUsXG4gICAgfTtcblxuICAgIGlmICh0aGlzLmhpZ2hzY29yZS5sZW5ndGggPT09IDUpIC8vIGlmIHRoZXJlIGlzIGFscmVhZHkgZml2ZSBoaWdoc2NvcmUgaW4gdGhlIGxvY2FsU3RvcmFnZVxuICAgIHtcbiAgICAgIHRoaXMuaGlnaHNjb3JlLnNwbGljZSgtMSwgMSk7IC8vIElmIHRoZSBmaXJzdCBwYXJhbSBpcyBuZWdhdGl2ZSwgd2lsbCBiZWdpbiB0aGF0IG1hbnkgZWxlbWVudHMgZnJvbSB0aGUgZW5kLlxuICAgIH1cblxuICAgIHRoaXMuaGlnaHNjb3JlLnB1c2godGhpc1Njb3JlKTtcbiAgICB0aGlzLmhpZ2hzY29yZSA9IHRoaXMuaGlnaHNjb3JlLnNvcnQoZnVuY3Rpb24oYSwgYikgLy8gc29ydCB0aGUgYXJyYXlcbiAgICB7XG4gICAgICByZXR1cm4gYS5zY29yZSAtIGIuc2NvcmU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNhdmVUb0ZpbGUoKTsgLy8gc2F2ZSB0aGUgZGF0YVxuICAgIGFkZGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gYWRkZWQ7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHNhdmVUb0ZpbGVcbiAqIEByb2xlIHNhdmUgdGhlIGRhdGFcbiAqL1xuSGlnaHNjb3JlLnByb3RvdHlwZS5zYXZlVG9GaWxlID0gZnVuY3Rpb24oKVxue1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsLCBKU09OLnN0cmluZ2lmeSh0aGlzLmhpZ2hzY29yZSkpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiBjcmVhdGVIaWdoc2NvcmVcbiAqIEByZXR1cm5zIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5IaWdoc2NvcmUucHJvdG90eXBlLmNyZWF0ZUhpZ2hzY29yZSA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciB0ZW1wbGF0ZTtcbiAgdmFyIGhzVXNlcm5hbWU7XG4gIHZhciBoc1Njb3JlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oaWdoc2NvcmUubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfaGlnaHNjb3JlX3Jvd1wiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTsgLy8gY2FsbCB0ZW1wbGF0ZVxuICAgIGhzVXNlcm5hbWUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiLmhzX3VzZXJuYW1lXCIpO1xuICAgIGhzU2NvcmUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiLmhzX3Njb3JlXCIpO1xuICAgIGhzVXNlcm5hbWUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5oaWdoc2NvcmVbaV0udXNlcm5hbWUpKTtcbiAgICBoc1Njb3JlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaGlnaHNjb3JlW2ldLnNjb3JlICsgXCIgIHNlY29uZHNcIikpO1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICB9XG4gIHJldHVybiBmcmFnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIaWdoc2NvcmU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBDb2xpbiBGUkFQUEVSXG4gKiBEYXRlIDogMjYvMDkvMjAxNlxuICovXG5cbi8qKlxuICogQ29uc3RydWN0b3IgUXVlc3Rpb25cbiAqIEBwYXJhbSBvYmpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBRdWVzdGlvbihvYmopXG57XG4gIHRoaXMuaWQgPSBvYmouaWQ7XG4gIHRoaXMucXVlc3Rpb24gPSBvYmoucXVlc3Rpb247XG4gIHRoaXMuYWx0ID0gb2JqLmFsdGVybmF0aXZlcztcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiBwcmludFxuICogQHJvbGUgY2FsbCBmdW5jdGlvbiB0byBkaXNwbGF5IHF1ZXN0aW9uXG4gKi9cblF1ZXN0aW9uLnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKClcbntcbiAgaWYgKHRoaXMuYWx0KSAvLyBpZiB0aGUgcXVlc3Rpb24gdXNlIGFsdGVybmF0aXZlIHJlc3BvbnNlXG4gIHtcbiAgICB0aGlzLnByaW50QWx0UXVlc3Rpb24oKTtcbiAgfVxuICBlbHNlIC8vIGNsYXNzaWMgcXVlc3Rpb25cbiAge1xuICAgIHRoaXMucHJpbnRRdWVzdGlvbigpO1xuICB9XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5mb2N1cygpOyAvLyBzbyB3ZSBjYW4gdXNlIGtleWJvYXJkXG5cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gY2xlYXJFbGVtZW50XG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJvbGUgY2xlYXIgbGFzdGNoaWxkIG9mIHRoZSBlbGVtZW50IHBhc3NlZCBpbiBwYXJhbWV0ZXJcbiAqL1xuUXVlc3Rpb24ucHJvdG90eXBlLmNsZWFyRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpXG57XG4gIHdoaWxlIChlbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSlcbiAge1xuICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5sYXN0Q2hpbGQpO1xuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHByaW50QWx0UXVlc3Rpb25cbiAqIEByb2xlIHByaW50IGNoZWNrYm94IHRvIHRoZSBwYWdlXG4gKi9cblF1ZXN0aW9uLnByb3RvdHlwZS5wcmludEFsdFF1ZXN0aW9uID0gZnVuY3Rpb24oKVxue1xuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX3F1ZXN0aW9uX2FsdFwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTsgLy8gY2FsbCB0ZW1wbGF0ZVxuICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiLnF1ZXN0aW9uSGVhZFwiKS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlF1ZXN0aW9uIDogXCIgKyB0aGlzLnF1ZXN0aW9uKSk7XG5cbiAgdmFyIGlucHV0RnJhZyA9IHRoaXMuZ2V0QWx0RnJhZygpOyAvLyBnZXQgdGhlIGZyYWdtZW50IGZvciBhbHRlcm5hdGl2ZXNcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5xdWVzdGlvbkZvcm1cIikuaW5zZXJ0QmVmb3JlKGlucHV0RnJhZywgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5zdWJtaXRcIikpOyAvLyBpbnNlcmUgY2hlY2tib3ggYmVmb3JlIHN1Ym1pdFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRleHRcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIGdldEFsdEZyYWdcbiAqIEByZXR1cm5zIHtEb2N1bWVudEZyYWdtZW50fVxuICogQHJvbGUgcmV0dXJuIHRoZSBmcmFnbWVudCBmb3IgYWx0ZXJuYXRpdmVzIChjaGVja2JveCBpbiB0aGlzIGNhc2UpXG4gKi9cblF1ZXN0aW9uLnByb3RvdHlwZS5nZXRBbHRGcmFnID0gZnVuY3Rpb24oKVxue1xuICB2YXIgaW5wdXRGcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB2YXIgaW5wdXQ7XG4gIHZhciBsYWJlbDtcbiAgdmFyIGZpcnN0ID0gdHJ1ZTtcblxuICBmb3IgKHZhciBhbHQgaW4gdGhpcy5hbHQpIC8vIGZvciBlYWNoIGFsdCBmb3IgdGhlIHF1ZXN0aW9uXG4gIHtcbiAgICBpZiAodGhpcy5hbHQuaGFzT3duUHJvcGVydHkoYWx0KSkvLyBpZiBKc29uLWZpbGUoc3RvcmFnZSkgaGFzIGEgcHJvcGVydHkgbmFtZWQgYWx0XG4gICAge1xuICAgICAgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX2FsdGVybmF0aXZlXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpOyAvL2NhbGwgdGVtcGxhdGVcbiAgICAgIGlmIChmaXJzdCkgLy8gaWYgdGhlIGNoZWNrYm94IGlzIFwiY2xpY2tlZFwiXG4gICAgICB7XG4gICAgICAgIGlucHV0LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5zZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIsIFwiY2hlY2tlZFwiKTtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlucHV0LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBhbHQpO1xuICAgICAgbGFiZWwgPSBpbnB1dC5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XG4gICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmFsdFthbHRdKSk7IC8vIGNyZWF0ZSBhIHRleHQgbm9kZSB3aXRoIHRoZSBcIm5hbWVkIG9mIGFsdFwiXG5cbiAgICAgIGlucHV0RnJhZy5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbnB1dEZyYWc7XG59O1xuXG5cbi8qKlxuICogRnVuY3Rpb24gcHJpbnRRdWVzdGlvblxuICogQHJvbGUgZGlzcGxhdCB0aGUgcXVlc3Rpb25cbiAqL1xuUXVlc3Rpb24ucHJvdG90eXBlLnByaW50UXVlc3Rpb24gPSBmdW5jdGlvbigpXG57XG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfcXVlc3Rpb25cIikuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7IC8vIGNhbGwgdGVtcGxhdGVcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5xdWVzdGlvbkhlYWRcIikuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJRdWVzdGlvbiA6IFwiICsgdGhpcy5xdWVzdGlvbikpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRleHRcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuZm9jdXMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb247XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRlJBUFBFUlxuICogRGF0ZSA6IDI2LzA5LzIwMTZcbiAqL1xuXG4vLyByZXF1aXJlXG52YXIgUXVlc3Rpb24gPSByZXF1aXJlKFwiLi9xdWVzdGlvblwiKTtcbnZhciBBamF4ID0gcmVxdWlyZShcIi4vYWpheFwiKTtcbnZhciBUaW1lciA9IHJlcXVpcmUoXCIuL3RpbWVyXCIpO1xudmFyIEhpZ2hzY29yZSA9IHJlcXVpcmUoXCIuL2hpZ2hTY29yZVwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciBRdWl6LCBpbml0YWxpc2UgdGhlIHZhcmlhYmxlc1xuICogQHBhcmFtIHVzZXJcbiAqIEBwYXJhbSBVUkxcbiAqIEBjb25zdHJ1Y3RvciBRdWl6XG4gKi9cbmZ1bmN0aW9uIFF1aXoodXNlciwgVVJMKVxue1xuICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgdGhpcy50aW1lciA9IHVuZGVmaW5lZDtcbiAgdGhpcy5xdWVzdGlvbiA9IHVuZGVmaW5lZDtcbiAgdGhpcy5uZXh0VVJMID0gVVJMIDtcbiAgdGhpcy5idXR0b24gPSB1bmRlZmluZWQ7XG4gIHRoaXMuZm9ybSA9IHVuZGVmaW5lZDtcbiAgdGhpcy50b3RhbFRpbWUgPSAwO1xuXG4gIC8vcmVxdWVzdCB0aGUgZmlyc3QgcXVlc3Rpb25cbiAgdGhpcy5nZXRRdWVzdGlvbigpO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIGdldFF1ZXN0aW9uICggcHJvdG90eXBlIGlzIHVzZWQgZm9yIGluaGVyaXRhbmNlIClcbiAqIEByb2xlICBzZW5kIGEgcmVxdWVzdCBmb3IgYSBuZXcgcXVlc3Rpb25cbiAqL1xuXG5RdWl6LnByb3RvdHlwZS5nZXRRdWVzdGlvbiA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGNvbmZpZyA9IHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOiB0aGlzLm5leHRVUkxcbiAgfTtcbiAgdmFyIHJlc3BGdW5jdGlvbiA9IHRoaXMucmVzcG9uc2UuYmluZCh0aGlzKTsgLy8gY3JlYXRlIGEgY29weSBvZiB0aGlzIGZ1bmN0aW9uXG5cbiAgQWpheC5HZXRIdHRwUmVxdWVzdChjb25maWcsIHJlc3BGdW5jdGlvbik7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHJlc3BvbnNlXG4gKiBAcGFyYW0gZXJyb3JcbiAqIEBwYXJhbSByZXNwXG4gKiBAcm9sZSBoYW5kbGUgdGhlIHJlc3BvbnNlLCB1c2VkIGFzIGFuIGFyZ3VtZW50ICdjYWxsYmFjaycgZm9yIGEgcmVxdWVzdCAoYWpheC5qcykgLlxuICovXG5RdWl6LnByb3RvdHlwZS5yZXNwb25zZSA9IGZ1bmN0aW9uKGVycm9yLCByZXNwKVxue1xuICAvLyA0MDQgbWVhbnMgbm8gbW9yZSBxdWVzdGlvbnNcbiAgaWYgKGVycm9yKVxuICB7XG4gICAgdGhpcy5nYW1lT3ZlcigpO1xuICB9XG4gIGlmIChyZXNwKSAvLyBpZiB0aGVyZSBpcyBhIHJlc3BvbnNlXG4gIHtcbiAgICB2YXIgb2JqID0gSlNPTi5wYXJzZShyZXNwKTsgIC8vcGFyc2UgdG8gSlNPTlxuXG4gICAgdGhpcy5uZXh0VVJMID0gb2JqLm5leHRVUkw7IC8vIGdldCB0aGUgbmV4dCBVUkxcblxuICAgIGlmIChvYmoucXVlc3Rpb24pIC8vIGlmIHRoZXJlIGlzIGEgcXVlc3Rpb24sIHdlIGNhbGwgYSBmdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBxdWVzdGlvblxuICAgIHtcbiAgICAgIHRoaXMucmVzcG9uc2VRdWVzdGlvbihvYmopO1xuICAgIH1cbiAgICBlbHNlIC8vIGVsc2Ugd2UgY2hlY2sgaWYgaXQncyBhIGNvcnJlY3QgYW5zd2VyXG4gICAge1xuICAgICAgaWYgKHRoaXMubmV4dFVSTCB8fCBvYmoubWVzc2FnZSA9PT0gXCJDb3JyZWN0IGFuc3dlciFcIilcbiAgICAgIHtcbiAgICAgICAgdGhpcy5yZXNwb25zZUFuc3dlcihvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHJlc3BvbnNlUXVlc3Rpb25cbiAqIEBwYXJhbSBvYmpcbiAqIEByb2xlIGRpc3BsYXkgdGhlIHF1ZXN0aW9uIGFuZCBhIHRpbWVyXG4gKi9cblF1aXoucHJvdG90eXBlLnJlc3BvbnNlUXVlc3Rpb24gPSBmdW5jdGlvbihvYmopXG57XG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZXh0XCIpO1xuICB0aGlzLmNsZWFyRWxlbWVudChjb250ZW50KTtcblxuICB0aGlzLnF1ZXN0aW9uID0gbmV3IFF1ZXN0aW9uKG9iaik7IC8vIG5ldyBxdWVzdGlvbiB3aXRoIHRoZSBkYXRhIGluc2lkZSBvYmpcbiAgdGhpcy5xdWVzdGlvbi5wcmludCgpOyAvLyBkaXNwbGF5IHRoZSBxdWVzdGlvblxuXG4gIHRoaXMudGltZXIgPSBuZXcgVGltZXIodGhpcywgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aW1lciBwXCIpLCAyMCk7ICAgLy9jcmVhdGUgYSBuZXcgdGltZXIgZm9yIHF1ZXN0aW9uXG4gIHRoaXMudGltZXIuc3RhcnQoKTsgLy8gc3RhcnQgdGhlIHRpbWVyXG5cbiAgdGhpcy5hZGRMaXN0ZW5lcigpO1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHJlc3BvbnNlQW5zd2VyXG4gKiBAcGFyYW0gb2JqXG4gKiBAcm9sZSBjaGVjayBpZiB0aGUgYW5zd2VyIGlzIGNvcnJlY3QsIGlmIHRoZXJlIGlzIG5vIG5leHRVcmwgdGhlbiB0aGUgZ2FtZSBpcyBjb21wbGV0ZWRcbiAqL1xuUXVpei5wcm90b3R5cGUucmVzcG9uc2VBbnN3ZXIgPSBmdW5jdGlvbihvYmopXG57XG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZXh0XCIpO1xuICB0aGlzLmNsZWFyRWxlbWVudChjb250ZW50KTtcblxuICAvL0hhbmRsZSB0aGUgdGVtcGxhdGUgZm9yIGFuc3dlclxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX2Fuc3dlclwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgdmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvYmoubWVzc2FnZSk7XG4gIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJwXCIpLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICBpZiAodGhpcy5uZXh0VVJMKVxuICB7XG4gICAgdmFyIG5ld1F1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbi5iaW5kKHRoaXMpO1xuICAgIHNldFRpbWVvdXQobmV3UXVlc3Rpb24sIDUwMCk7XG4gIH1cbiAgZWxzZSAvLyBHYW1lIGlzIGZpbmlzaFxuICB7XG4gICAgdGhpcy5nYW1lQ29tcGxldGVkKCk7XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gYWRkTGlzdGVuZXJcbiAqIEByb2xlIGFkZCBsaXN0ZW5lciBmb3Igc3VibWl0XG4gKi9cblF1aXoucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24oKVxue1xuICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VibWl0XCIpO1xuICB0aGlzLmZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnF1ZXN0aW9uRm9ybVwiKTtcblxuICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5zdWJtaXQuYmluZCh0aGlzKSwgdHJ1ZSk7XG4gIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgdGhpcy5zdWJtaXQuYmluZCh0aGlzKSwgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHN1Ym1pdFxuICogQHBhcmFtIGV2ZW50XG4gKiBAcm9sZVxuICovXG5RdWl6LnByb3RvdHlwZS5zdWJtaXQgPSBmdW5jdGlvbihldmVudClcbntcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LnR5cGUgPT09IFwiY2xpY2tcIikgLy8gaWYgdXNlcnMgY2xpY2sgb3IgcHJlc3MgZW50ZXIgKGtleUNvZGUgPT09IDEzKVxuICB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMudG90YWxUaW1lICs9IHRoaXMudGltZXIuc3RvcCgpO1xuICAgIHZhciBpbnB1dDtcblxuICAgIHRoaXMuYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnN1Ym1pdC5iaW5kKHRoaXMpKTsgICAgIC8vYXZvaWQgZG91YmxlLXN1Ym1pdFxuICAgIHRoaXMuZm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgdGhpcy5zdWJtaXQuYmluZCh0aGlzKSk7XG5cbiAgICAvL3NhdmUgaW5wdXQgZGVwZW5kaW5nIG9uIHRoZSB0eXBlIG9mIHF1ZXN0aW9uXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYW5zd2VyXCIpKSAvLyBpZiBpdCdzIGEgcXVlc3Rpb24gd2l0aCBpbnB1dCB0ZXh0XG4gICAge1xuICAgICAgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fuc3dlclwiKS52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSAgLy9lbHNlIGl0cyBhIHF1ZXN0aW9uIHdpdGggcmFkaW9idXR0b25cbiAgICB7XG4gICAgICBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPSdhbHRlcm5hdGl2ZSddOmNoZWNrZWRcIikudmFsdWU7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZyA9IHsgICAgIC8vc2V0IHRoZSBjb25maWdcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICB1cmw6IHRoaXMubmV4dFVSTCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYW5zd2VyOiBpbnB1dFxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzcEZ1bmN0aW9uID0gdGhpcy5yZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIEFqYXguR2V0SHR0cFJlcXVlc3QoY29uZmlnLCByZXNwRnVuY3Rpb24pO1xuICB9XG59O1xuXG5cbi8qKlxuICogRnVuY3Rpb24gZ2FtZU92ZXJcbiAqIEBwYXJhbSBjYXVzZVxuICogQHJvbGUgR2FtZSBpcyBvdmVyIChZb3UgbG9zdClcbiAqL1xuUXVpei5wcm90b3R5cGUuZ2FtZU92ZXIgPSBmdW5jdGlvbihjYXVzZSlcbntcbiAgdmFyIGhpZ2hfc2NvcmUgPSBuZXcgSGlnaHNjb3JlKFwiaGlnaFNjb3JlXCIsIHRoaXMudXNlcm5hbWUpO1xuICB2YXIgdGl0bGU7XG5cbiAgdGhpcy5jbGVhckVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZXh0XCIpKTtcblxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX3F1aXpfZW5kXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpOyAvLyBjYWxsIHRlbXBsYXRlXG5cbiAgdmFyIHNob3dTY29yZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCIuc2hvd19zY29yZVwiKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcImRpdlwiKS5yZW1vdmVDaGlsZChzaG93U2NvcmUpO1xuXG4gIGlmIChjYXVzZSA9PT0gXCJ0aW1lc1VQXCIpXG4gIHtcbiAgICB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVGltZSBpcyBvdmVyICFcIik7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIldyb25nIGFuc3dlciFcIik7XG4gIH1cblxuICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiaDRcIikuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gIGlmIChoaWdoX3Njb3JlLmhpZ2hzY29yZS5sZW5ndGggPiAwKSAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSBoaWdoc2NvcmVcbiAge1xuICAgIHZhciBoc0ZyYWcgPSBoaWdoX3Njb3JlLmNyZWF0ZUhpZ2hzY29yZSgpO1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKS5hcHBlbmRDaGlsZChoc0ZyYWcpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIk5vIGhpZ2hzY29yZSB5ZXQgOihcIikpO1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRleHRcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuXG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIGdhbWVDb21wbGV0ZWRcbiAqIEByb2xlIGRpc3BsYXkgaW5mb3JtYXRpb24gd2hlbiB0aGUgZ2FtZSBpcyBjb21wbGV0ZWRcbiAqL1xuUXVpei5wcm90b3R5cGUuZ2FtZUNvbXBsZXRlZCA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGhpZ2hfc2NvcmUgPSBuZXcgSGlnaHNjb3JlKFwiaGlnaFNjb3JlXCIsIHRoaXMudXNlcm5hbWUsIHRoaXMudG90YWxUaW1lLnRvRml4ZWQoMykpOyAvLyB0b0ZpeGVkIHVzZWQgdG8gZGlzcGxheSBtaWxsaXNlY29uZHNcbiAgdmFyIGlzTmV3ID0gaGlnaF9zY29yZS5hZGRUb0xpc3QoKTsgLy8gYWRkIG5ldyBoaWdoU2NvcmUgdG8gdGhlIGxpc3RcblxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX3F1aXpfZW5kXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpOyAvLyBjYWxsIHRlbXBsYXRlXG5cbiAgaWYgKGhpZ2hfc2NvcmUuaGlnaHNjb3JlLmxlbmd0aCA+IDApICAvLyBpZiB0aGVyZSBpcyBhbHJlYWR5IGhpZ2hTb2NyZVxuICB7XG4gICAgdmFyIGhzRnJhZyA9IGhpZ2hfc2NvcmUuY3JlYXRlSGlnaHNjb3JlKCk7XG4gICAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcInRhYmxlXCIpLmFwcGVuZENoaWxkKGhzRnJhZyk7XG4gIH1cblxuICBpZiAoaXNOZXcpIC8vIGlmIHRoZSB0aW1lIGlzIGJldHRlciB0aGFuIHRoZSBvdGhlciA1IG9uZVxuICB7XG4gICAgdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJOZXcgU2NvcmUhXCIpO1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJoNFwiKS5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gIH1cblxuICB0aGlzLmNsZWFyRWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRleHRcIikpO1xuXG4gIHZhciBoMSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCIudGltZVwiKTtcbiAgdmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLnRvdGFsVGltZS50b0ZpeGVkKDMpKTtcbiAgaDEuYXBwZW5kQ2hpbGQodGV4dCk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGV4dFwiKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG5cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gY2xlYXJFbGVtZW50XG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHJvbGUgY2xlYXIgYSBzcGVjaWZpYyBlbGVtZW50IG9mIGNoaWxkc1xuICovXG5RdWl6LnByb3RvdHlwZS5jbGVhckVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KVxue1xuICB3aGlsZSAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpXG4gIHtcbiAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWl6O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IENvbGluIEZSQVBQRVJcbiAqIERhdGUgOiAyNi8wOS8yMDE2XG4gKi9cblxuLyoqXG4gKiBDb25zdHJ1Y3RvciBUaW1lclxuICogQHBhcmFtIGNvbnRlbnRcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gdGltZVxuICogQGNvbnN0cnVjdG9yIFRpbWVyXG4gKi9cbmZ1bmN0aW9uIFRpbWVyKGNvbnRlbnQsIGVsZW1lbnQsIHRpbWUpXG57XG4gIHRoaXMudGltZSA9IHRpbWU7XG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG4gIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHRoaXMuaW50ZXJ2YWwgPSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gc3RhcnRcbiAqIEByb2xlIHN0YXJ0cyBhbiBpbnRlcnZhbCBmb3IgdGhlIHRpbWVyXG4gKi9cblRpbWVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMucnVuLmJpbmQodGhpcyksIDEwMCk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHJ1blxuICogQHJvbGVcbiAqL1xuVGltZXIucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGF0bSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gIHZhciBkaWZmID0gKGF0bSAtIHRoaXMuc3RhcnRUaW1lKSAvIDEwMDA7IC8vZGlmZmVyZW5jZSBmcm9tIHN0YXJ0IHRvIGF0IHRoZSBtb21lbnQgKGF0bSlcblxuICB2YXIgc2hvd1RpbWUgPSB0aGlzLnRpbWUgLSBkaWZmOyAgLy8gc2hvdyBjb3VudGRvd25cblxuICBpZiAoZGlmZiA+PSB0aGlzLnRpbWUpXG4gIHtcbiAgICBzaG93VGltZSA9IDA7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB0aGlzLmNvbnRlbnQuZ2FtZU92ZXIoXCJ0aW1lc1VQXCIpOyAvLyBUaW1lcyB1cFxuICB9XG4gIGlmIChzaG93VGltZSA8PSAxMCkgLy8gc2hvdyBkZWNpbWFscyBpZiB1bmRlciAxMCBzZWNvbmRzXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvbG9yXCIpOyAvLyBkaXNwbGF5IHJlZCBUaW1lclxuICAgIHRoaXMucHJpbnQoXCJUaW1lIGxlZnQgOiBcIiArIHNob3dUaW1lLnRvRml4ZWQoMSkpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRoaXMucHJpbnQoXCJUaW1lIGxlZnQgOiBcIiArIHNob3dUaW1lLnRvRml4ZWQoMCkpO1xuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHN0b3BcbiAqIEByZXR1cm5zIHtudW1iZXJ9LCBkaWZmZXJlbmNlIGluIHNlY29uZHNcbiAqIEByb2xlIHN0b3AgdGhlIHRpbWVyXG4gKi9cblRpbWVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKVxue1xuICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHJldHVybiAobm93IC0gdGhpcy5zdGFydFRpbWUpIC8gMTAwMDtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gcHJpbnRcbiAqIEBwYXJhbSBkaWZmXG4gKiBAcm9sZSByZXBsYWNlXG4gKi9cblRpbWVyLnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKGRpZmYpXG57XG4gIHRoaXMuZWxlbWVudC5yZXBsYWNlQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGlmZiksIHRoaXMuZWxlbWVudC5maXJzdENoaWxkKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iXX0=
