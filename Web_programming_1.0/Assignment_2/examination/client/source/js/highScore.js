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

