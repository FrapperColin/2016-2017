/**
 * Created by Colin Frapper
 * 23/10/2016
 */
"use strict";

var MemoryApp = require("./Memory/MemoryApp");
var ChatApp = require("./Chat/ChatApp");
var CanvasApp = require("./Canvas/CanvasApp");

/**
 * Constructor
 * @param desktop
 * @constructor
 */

function LauncherMenu(desktop)
{
  this.desktop = desktop;
}

/**
 *
 */
LauncherMenu.prototype.start = function()
{
  document.querySelector(".launcher_menu").addEventListener("click", this.launcherClick.bind(this), true); // add listner
};

/**
 * Function to handle the clicks in the launcher
 * @param event
 */
LauncherMenu.prototype.launcherClick = function(event)
{
  var value;
  var icon;
  var title;

  var element = this.getClickedLauncherElement(event.target); // get element we clicked

  if (element) // if we cliked on an element
  {
    value = element.getAttribute("value"); // get his value
  }

  if (value) // if he had a value
  {
    var switchTo = value.split(":"); // split between id and the "real" value

    if (switchTo[0] === "id") // if we cliked on a window "already open"
    {
      if (element.classList.contains("tooltip_close"))
      {
        this.desktop.closeWindow(switchTo[1]); // close this windows
      }
      else
      {
        this.switchToWindow(switchTo[1]); // switch
      }
    }
    else // start the app where we cliked
    {
      icon = element.querySelector("i").textContent; // get the icon
      title = element.querySelector(".tool_title").textContent; // get the title
      this.startApplication(value, icon, title);
    }
  }
};


/**
 * Function to get what element got clicked in the launcher
 * @param target - the event-target from click
 * @returns DOM-element
 */
LauncherMenu.prototype.getClickedLauncherElement = function(target)
{
  var element;

  if (target.getAttribute("value"))
  {
    element = target;
  }
  else if (target.parentNode.getAttribute("value"))
  {
    element = target.parentNode; // if it's the i tag in the li
  }
  return element;
};

/**
 * Function to start new application
 */
LauncherMenu.prototype.startApplication = function(type, icon, title)
{
  var marginX = 10 * (this.desktop.offsetX); // move a little bit the new window compared to the old window
  var marginY = 10 * (this.desktop.offsetY); // move a little bit the new window compared to the old window

  // set the option
  var appOptions =
  {
    id: "window_n°" + this.desktop.id_number, // id of the window
    x: marginX,
    y: marginY,
    zIndex: this.desktop.zIndex,
    icon: icon,
    title: title,
    keyActivated: false
  };

  var newApp = this.createApplication(type, appOptions);

  if (newApp)
  {
    var buttons = document.querySelector("#" + newApp.id + " .window_buttons");     //add listener to the window buttons
    buttons.addEventListener("click", this.desktop.windowButtonClick.bind(this.desktop));

    this.desktop.windows.push(newApp); // insert in the array windows

    this.addMenuApp(type, newApp);

    this.desktop.id_number += 1; // inscrease the id
    this.desktop.offsetX += 1; // inscrease the offsetX
    this.desktop.offsetY += 1; // inscrease the offsetY

    //set focus to the new app and check bounds
    this.desktop.setFocus(newApp.element);
    this.checkBounds(newApp);
  }
};

LauncherMenu.prototype.createApplication = function(type, appOptions) {
  var newApp;

  //check what app to start and start it, add eventually and keyActivated
  switch (type)
  {
    case "Reset":
    {
      this.desktop.clearDesktop();  //reset the desktop
      break;
    }
    case "Memory":
    {
      appOptions.keyActivated = true; // to play with the keyboard
      newApp = new MemoryApp(appOptions);
      newApp.start();
      break;
    }

    case "Chat":
    {
      newApp = new ChatApp(appOptions);
      newApp.start();

      break;
    }

    case "Canvas" :
    {
      newApp = new CanvasApp(appOptions);
      newApp.start();
    }
  }
  return newApp;
};

/**
 * Function to handle if the new window is out of bounds
 * @param app - the app-object to be checked
 */
LauncherMenu.prototype.checkBounds = function(app)
{
  var windowW = window.innerWidth; // get the dimension of the window
  var windowH = window.innerHeight; // get the dimension of the window

  var appRight = app.x + parseInt(app.element.offsetWidth);
  var appBot = app.y + parseInt(app.element.offsetHeight);

  if (appRight > windowW || app.x < 0) // if the bounds are cross at the right of the window
  {
    this.desktop.offsetX = 1; // reset the offsetX

    app.x = 10 * (this.desktop.offsetX); // set new param
    app.element.style.left = app.x + "px"; // set the dimension
  }
  else if (appBot > windowH || app.y < 0) // if the bounds are cross at the bottom of the window
  {
    this.desktop.offsetY = 1;    //reset the offsetY

    app.y = 10 * (this.desktop.offsetY); // set new param
    app.element.style.top = app.y + "px"; // set the dimension
  }
};


/**
 * Function to handle focus on call, and show minimized window again
 * @param id - the window-id to set focus on
 */
LauncherMenu.prototype.switchToWindow = function(id)
{
  var window = document.querySelector("#" + id);
  if (window)
  {
    if (window.classList.contains("minimized")) // if the windows was minimized
    {
      window.classList.remove("minimized");
    }
    this.desktop.setFocus(window); // set focus
  }
};

/**
 * Function to add a new app
 */
LauncherMenu.prototype.addMenuApp = function(type, app)
{
  var container = document.querySelector("li[value='" + type + "'] .tool_container");
  var template = document.querySelector("#template_tooltip").content.cloneNode(true);
  template.querySelector(".tooltip").appendChild(document.createTextNode(app.title + "(" + app.id + ")"));
  template.querySelector(".tooltip").setAttribute("value", "id:" + app.id);
  template.querySelector(".tooltip_close").setAttribute("value", "id:" + app.id);

  container.appendChild(template);

};


module.exports = LauncherMenu ;
