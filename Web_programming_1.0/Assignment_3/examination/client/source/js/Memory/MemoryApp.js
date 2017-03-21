/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";

var Window = require ("../Window");
var Game = require("./MemoryGame");

/**
 * Constructor
 * @param options
 * @constructor
 */
function MemoryApp(options)
{
  Window.call(this,options);

  this.settingsOpen = false; // to display or not the settings
  this.game = undefined; // the memory games
  this.boardSize = [4, 4]; // rules
  this.markedCard = undefined; // for the keyboard
}

MemoryApp.prototype = Object.create(Window.prototype); // inheritance
MemoryApp.prototype.constructor =  MemoryApp;


/**
 * Function to init the basics
 */
MemoryApp.prototype.start = function()
{
  this.display();

  this.element.querySelector(".window_menu").addEventListener("click", this.menuClicked.bind(this));

  //create new game and init it
  this.game = new Game(4, 4,this.element.querySelector(".window_content"));
  this.game.start();
};

/**
 * Function to display the application
 */
MemoryApp.prototype.display = function()
{
  Window.prototype.display.call(this);
  this.element.classList.add("memory_app");

  var menu = this.element.querySelector(".window_menu");
  var alt1 = document.querySelector("#template_menu").content.cloneNode(true);
  alt1.querySelector(".menu").appendChild(document.createTextNode("New Game"));

  var alt2 = document.querySelector("#template_menu").content.cloneNode(true);
  alt2.querySelector(".menu").appendChild(document.createTextNode("Settings"));

  menu.appendChild(alt1);
  menu.appendChild(alt2);
};

/**
 * Function to handle the menu-clicked
 * @param event - click-event
 */
MemoryApp.prototype.menuClicked = function(event)
{
  var target;
  if (event.target.tagName.toLowerCase() === "a")  // if we clicked on the one of the a tag menu
  {
    target = event.target.textContent ;
  }


  if (target) //check what was clicked
  {
    switch (target)
    {
      case "Settings":
      {
        this.menuSettings(); // display settings
        break;
      }

      case "New Game":
      {
        if (this.settingsOpen)
        {
          this.settingsOpen = false;  //hide the settings
        }
        this.restart(); // restart
        break;
      }
    }
  }
};

/**
 * Function to restart the game
 * @param value - the board-size (eg. 4x4)
 */
MemoryApp.prototype.restart = function(value)
{
  if (value)
  {
    this.boardSize = value.split("x");
  }

  var y = this.boardSize[1]; // fin dimension
  var x = this.boardSize[0]; // fin dimension

  //clear the content
  this.clearContentWindow();

  //remove old eventhandlers
  this.game.removeEvents();

  //create new game and init it
  this.game = new Game(x, y,this.element.querySelector(".window_content"));
  this.game.start();
};

/**
 * Function to show/hide the settings
 */
MemoryApp.prototype.menuSettings = function()
{
  if (!this.settingsOpen)
  {
    var template = document.querySelector("#template_settings").content.cloneNode(true);
    template.querySelector(".settings").classList.add("memory_settings");

    template = this.addSettings(template);
    this.element.querySelector(".window_content").appendChild(template);
    this.settingsOpen = true;
  }
  else
    {
    //hide the settings
    var settings = this.element.querySelector(".settings_wrapper");
    this.element.querySelector(".window_content").removeChild(settings);
    this.settingsOpen = false;
  }
};

/**
 * Function to add the settings
 * @param element - the element to print to
 * @returns {*} - the element
 */
MemoryApp.prototype.addSettings = function(element)
{
  var template = document.querySelector("#template_memory_settings").content.cloneNode(true);

  element.querySelector(".settings").appendChild(template);
  element.querySelector("input[type='button']").addEventListener("click", this.saveSettings.bind(this));
  return element;
};


/**
 * Function to save the settings and run new game
 */
MemoryApp.prototype.saveSettings = function()
{
  var value = this.element.querySelector("select[name='board-size']").value;

  //restart with the new settings
  this.restart(value);
  this.settingsOpen = false;
};

/**
 * Function to handle the key input
 * @param key - keycode to handle
 */
MemoryApp.prototype.keyInput = function(key)
{
  if (!this.markedCard)  // if there is no card marked
  {
    this.markedCard = this.element.querySelector(".card");
    this.markedCard.classList.add("marked"); // so we can do something with css
  }
  else
  {
    this.markedCard.classList.toggle("marked");
    switch (key)
    {
      case 39: // right key
      {
        this.keyRight();
        break;
      }
      case 37: // left key
      {
        this.keyLeft();
        break;
      }
      case 38: // up key
      {
        this.keyUp();
        break;
      }

      case 40: // down key
      {
        this.keyDown();
        break;
      }

      case 13: // enter
      {
        this.game.turnCard(this.markedCard);
        break;
      }
    }
    this.markedCard.classList.toggle("marked");
  }
};

/**
 * Function to handle if key right pressed
 */
MemoryApp.prototype.keyRight = function()
{
  if (this.markedCard.nextElementSibling)  // if there is a right sibling
  {
    this.markedCard = this.markedCard.nextElementSibling;
  }
  else
  {
    if (this.markedCard.parentNode.nextElementSibling) // if the marked card is the last one on the right
    {
      this.markedCard = this.markedCard.parentNode.nextElementSibling.firstElementChild;
    }
    else
    {
      this.markedCard = this.element.querySelector(".card"); // start from top
    }
  }
};

/**
 * Function to handle if key left pressed
 */
MemoryApp.prototype.keyLeft = function()
{
  //find previous card
  if (this.markedCard.previousElementSibling) //if there is a left sibling
  {
    this.markedCard = this.markedCard.previousElementSibling;
  }
  else
  {
    if (this.markedCard.parentNode.previousElementSibling) // if the marked card is the last one on the left
    {
      this.markedCard = this.markedCard.parentNode.previousElementSibling.lastElementChild;
    }
    else // start from bottom right
    {
      var rows = this.element.querySelectorAll(".row");
      var lastRow = rows[rows.length - 1];
      this.markedCard = lastRow.lastElementChild;
    }
  }
};

/**
 * Function to handle if key up pressed
 */
MemoryApp.prototype.keyUp = function()
{
  //find next row and card
  var row;
  var rowY;

  if (this.markedCard.parentNode.previousElementSibling)
  {
    var id = this.markedCard.classList[0].slice(-2); // slice(-2) extracts the last two elements in the sequence.
    rowY = parseInt(id.charAt(0)) - 1;
  }
  else
  {
    //begin from bottom
    var rows = this.element.querySelectorAll(".row");
    row = rows[rows.length - 1];
    rowY = rows.length - 1;
  }

  //find what x-position in the row the marked card is on
  var cardX = this.markedCard.classList[0].slice(-1);
  this.markedCard = this.element.querySelector(".card-" + rowY + cardX);
};

/**
 * Function to handle if key down pressed
 */
MemoryApp.prototype.keyDown = function()
{
  //find next row and card
  var rowY;

  if (this.markedCard.parentNode.nextElementSibling)
  {
    var id = this.markedCard.classList[0].slice(-2);
    rowY = parseInt(id.charAt(0)) + 1;
  }
  else
  {
    rowY = 0;
  }

  //find what x-position in the row the marked card is on
  var cardX = this.markedCard.classList[0].slice(-1); // last element
  this.markedCard = this.element.querySelector(".card-" + rowY + cardX);
};



module.exports = MemoryApp ;
