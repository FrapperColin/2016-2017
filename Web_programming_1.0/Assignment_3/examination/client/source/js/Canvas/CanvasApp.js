/**
 * Created by Colin Frapper
 * 23/10/2016
 */


"use strict";

var Window = require("../Window");
var Canvas = require("./Canvas");


function CanvasApp(options)
{
  Window.call(this, options);
  this.settingsOpen = false;
  this.draw = undefined ;

}

CanvasApp.prototype = Object.create(Window.prototype); // inheritance
CanvasApp.prototype.constructor =  CanvasApp;


CanvasApp.prototype.start = function ()
{
  this.display();

  this.element.querySelector(".window_menu").addEventListener("click", this.menuClicked.bind(this));


  //create new game and init it
  this.draw = new Canvas("black",this.element.querySelector(".window_content"));
  this.draw.start();
};


/**
 * Function to display the application
 */
CanvasApp.prototype.display = function()
{
  Window.prototype.display.call(this);
  console.log(this.element);
  this.element.classList.add("canvas_app");

  var menu = this.element.querySelector(".window_menu");
  var alt1 = document.querySelector("#template_menu").content.cloneNode(true);
  alt1.querySelector(".menu").appendChild(document.createTextNode("Settings"));

  menu.appendChild(alt1);
};

/**
 * Function to handle the menu-clicked
 * @param event - click-event
 */
CanvasApp.prototype.menuClicked = function(event)
{
  var target;
  if (event.target.tagName.toLowerCase() === "a")  // if we clicked on the one of the a tag menu
  {
    target = event.target.textContent ;
  }

  if (target)
  {
    if(target === "Settings")
    {
        this.menuSettings(); // display settings
    }
  }
};

/**
 * Function to show/hide the settings
 */
CanvasApp.prototype.menuSettings = function()
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
 * @param element - the element
 * @returns {*} - the element
 */
CanvasApp.prototype.addSettings = function(element)
{
  var template = document.querySelector("#template_canvas_settings").content.cloneNode(true);

  element.querySelector(".settings").appendChild(template);
  element.querySelector("input[type='button']").addEventListener("click", this.saveSettings.bind(this));
  return element;
};

/**
 * Function to save the settings and run new game
 */
CanvasApp.prototype.saveSettings = function()
{
  var value = this.element.querySelector("select[name='color']").value;

  //restart with the new settings
  this.restart(value);
  this.settingsOpen = false;
};

/**
 * Function to restart the game
 * @param value - the color
 */
CanvasApp.prototype.restart = function(value)
{
  //clear the content
  this.clearContentWindow();

  //create new draw and start it
  this.draw = new Canvas(value,this.element.querySelector(".window_content"));
  this.draw.start();
};


module.exports = CanvasApp ;
