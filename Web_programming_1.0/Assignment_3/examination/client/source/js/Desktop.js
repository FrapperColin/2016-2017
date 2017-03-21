/**
 * Created by Colin Frapper
 * 23/10/2016
 */
"use strict";

var LauncherMenu = require("./LauncherMenu");

function Desktop()
{
  this.mouseMove = this.mouseMoveFunction.bind(this);
  this.mouseUp = this.mouseUpFunction.bind(this);

  this.activeWindow = false; // to check which windows is focused
  this.windows = [];
  this.clickX = 0; // the position of the mouse
  this.clickY = 0; // the position of the mouse
  this.zIndex = 0; // for the focus
  this.id_number = 1 ; // the id of the window
  this.offsetX = 1 ; // the X of the window when she's created
  this.offsetY = 1 ; // the Y of the window when she's created
  this.launcher = new LauncherMenu(this);

}

/**
 * Function to handle the basic features of the desktop
 */
Desktop.prototype.start = function()
{
  this.launcher.start();

  document.addEventListener("mousedown", this.mouseDown.bind(this));
  document.addEventListener("keydown", this.keyDown.bind(this));
};



/**
 * Function to handle what will happen if mouse up
 */
Desktop.prototype.mouseUpFunction = function()
{
  window.removeEventListener("mousemove", this.mouseMove);
  window.removeEventListener("mouseup", this.mouseUp);
  this.activeWindow.element.classList.remove("moving");
};


/**
 * Function to handle what will happen when mouse is down
 * @param event
 */
Desktop.prototype.mouseDown = function(event) {
  var element = event.target; // check where we clicked

  if (element.parentNode.classList)  // if the parent contain a class
  {
    while (!element.parentNode.classList.contains("main_content")) // get the "content-element
    {
      element = element.parentNode;
    }
  }
  if (element.classList.contains("window")) // il we clicked on a window
  {
    if (parseInt(element.style.zIndex) !== this.zIndex) // if the window we cliked is not the one focused
    {
      this.setFocus(element); // set focus on the window
    }

    //add the listeners to check for movement if click were in the window_top of window
    if (event.target.classList.contains("window_top"))
    {
        this.clickX = event.clientX - this.activeWindow.x; // set the click
        this.clickY = event.clientY - this.activeWindow.y; // set the click
        element.classList.add("moving"); // for css check if we moved the windows

        window.addEventListener("mousemove", this.mouseMove);
        window.addEventListener("mouseup", this.mouseUp);
      }
  }

};

/**
 * Function to handle the mouse move
 * @param event
 */
Desktop.prototype.mouseMoveFunction = function(event)
{
  var newX = event.clientX - this.clickX; // get the new postion on the mouse
  var newY = event.clientY - this.clickY; // get the new postion on the mouse

  //check where the new middle should be
  var newMiddleX = newX + parseInt(this.activeWindow.element.offsetWidth) / 2;
  var newMiddleY = newY + parseInt(this.activeWindow.element.offsetHeight) / 2;

  var windowW = window.innerWidth; // get the width of the window
  var windowH = window.innerHeight; // get the height of the window

  if (newMiddleX < windowW && newMiddleX > 0 && newMiddleY < windowH && newMiddleY > 0)   //if the move is not out of bounds then move it
  {
    this.activeWindow.x = event.clientX - this.clickX;
    this.activeWindow.y = event.clientY - this.clickY;

    this.activeWindow.element.style.left = this.activeWindow.x + "px"; // add to the element the new dimension
    this.activeWindow.element.style.top = this.activeWindow.y + "px"; // add to the element the new dimension
  }
};

/**
 * Function to handle clicks on windows
 * @param event
 */
Desktop.prototype.windowButtonClick = function(event)
{
  var action = event.target.classList;

  var element = event.target;

  //get the 'parent' window-element
  if (element.parentNode)
  {
    while (!element.parentNode.id) // get the element with an id
    {
      element = element.parentNode;
    }

    element = element.parentNode;
  }

  var index = -1;
  for (var i = 0; i < this.windows.length; i += 1)    //check which window got clicked
  {
    if (this.windows[i].id === element.id)
    {
      index = i;
    }
  }

  if (index !== -1) // if we found that id
  {
    this.setFocus(this.windows[index].element);    //set focus

    if (action.contains("exit_button"))
    {
      this.closeWindow(this.windows[index].id);       //close the app
    }
    else if (action.contains("minimize_button"))
    {
      this.windows[index].minimize();       //minimize the app
    }
  }
};

/**
 * Function to close a window and destroy the app
 * @param id
 */
Desktop.prototype.closeWindow = function(id)
{
  var removed = false;
  for (var i = 0; i < this.windows.length && !removed; i++)
  {
    if (this.windows[i].id === id) // found the window with the id in paramater
    {
      var windowsClicked = document.querySelector("[value='id:" + this.windows[i].id + "']");
      var container = windowsClicked.parentNode;
      while (!container.classList.contains("tool_container")) // while we don't get the div class = container
      {
        container = container.parentNode;

      }

      container.removeChild(windowsClicked.parentNode); // remove the windows from container

      this.id_number --;
      this.windows[i].destroy();       // destroy the app
      this.windows.splice(i, 1);      // remove from window-list
      removed = true; // stop the for
    }
  }
};

/**
 * Function to clear and reset the desktop
 */
Desktop.prototype.clearDesktop = function()
{
  for (var i = 0; i < this.windows.length; i += 1)
  {
    this.windows[i].destroy(); // destroy all the windows

    var windowsClicked = document.querySelector("[value='id:" + this.windows[i].id + "']");
    var container = windowsClicked.parentNode;
    while (!container.classList.contains("tool_container")) // while we don't get the div class = tool_container
    {
      container = container.parentNode;
    }

    container.removeChild(windowsClicked.parentNode); // remove the windows from container
  }

  this.windows = []; // initalize window
  this.id_number = 0;
  this.offsetX = 1;
  this.offsetY = 1;
  this.zIndex = 0;
};

/**
 * Function to handle if key is pressed
 * @param event
*/
Desktop.prototype.keyDown = function(event)
{
  if (this.activeWindow.keyActivated)
  {
    this.activeWindow.keyInput(event.keyCode);
  }
};


/**
 * Set focus to an element
 * @param element - the element to set focus on
 */
Desktop.prototype.setFocus = function(element)
{
  element.focus(); // focus on the element clicked

  for (var i = 0; i < this.windows.length; i += 1)   //find the window in window-array
  {
    if (this.windows[i].id === element.id)
    {
      this.activeWindow = this.windows[i]; // change the active window
      this.zIndex += 1; // zIndex used for mettre la page devant l'aure
      element.style.zIndex = this.zIndex; // change style
    }
  }
};


module.exports = Desktop ;
