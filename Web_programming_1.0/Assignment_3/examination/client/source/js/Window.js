/**
 * Created by Colin Frapper
 * 23/10/2016
 */
"use strict";


function Window(options)
{
  this.id = options.id ; // the id of the window
  this.element = undefined; // the "window"
  this.x = options.x || 10; //
  this.y = options.y || 10;
  this.title = options.title ;
  this.icon = options.icon ;
  this.keyActivated = options.keyActivated || false;
  this.zIndex = options.zIndex;
}

/**
 * Destroy the window
 */
Window.prototype.destroy = function()
{
  document.querySelector("#main_content").removeChild(this.element);
};

/**
 * Creation of the window
 */
Window.prototype.display = function ()
{
  //get the template and modify it to the params
  var template  = document.querySelector("#template_window").content.cloneNode(true);
  var templateWindow = template.querySelector("div");
  templateWindow.setAttribute("id", this.id); // add the id of the window
  templateWindow.style.left = this.x + "px"; // set the postion
  templateWindow.style.top = this.y + "px"; // set the postion
  templateWindow.style.zIndex = this.zIndex; // set the zIndex (the focus)

  var element = document.querySelector("#main_content");
  var launcher = document.querySelector(".launcher_menu");
  element.insertBefore(template, launcher);   //insert the new window before launcher in the DOM

  //save the element to the object
  this.element = document.querySelector("#" + this.id);

  //add title and icon to the window
  this.element.querySelector(".window_title").appendChild(document.createTextNode(this.title));
  this.element.querySelector(".window_icon").appendChild(document.createTextNode(this.icon));
}

/**
 * Minimize the window
 */
Window.prototype.minimize = function()
{
  this.element.classList.toggle("minimized");
};

/**
 * Clear the window
 */
Window.prototype.clearContentWindow = function()
{
  var content = this.element.querySelector(".window_content"); // get the content of the window
  while (content.hasChildNodes())
  {
    content.removeChild(content.firstChild); // remove all of his child
  }
};


module.exports = Window ;
