/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";
var Window = require("../Window");
var Chat = require("./Chat");

/**
 * Constructor
 * @param options
 * @constructor
 */
function ChatApp(options)
{
  Window.call(this, options);
  this.chat = undefined;
  this.settingsOpen = false;
  this.username = "";
  this.server = "ws://vhost3.lnu.se:20080/socket/";
  this.channel = "";

  this.addFocusFunc = this.addFocus.bind(this);
  this.removeFocusFunc = this.removeFocus.bind(this);
}


ChatApp.prototype = Object.create(Window.prototype);
ChatApp.prototype.constructor =  ChatApp;

/**
 * Function to start the basics
 */
ChatApp.prototype.start = function()
{
  if (localStorage.getItem("username")) // if we had been connected before
  {
    this.username = localStorage.getItem("username");
  }

  this.display();

  //add listener to the menu
  this.element.querySelector(".window_menu").addEventListener("click", this.menuClicked.bind(this));
};

/**
* Function to display the application
*/
ChatApp.prototype.display = function()
{
  Window.prototype.display.call(this);

  this.element.classList.add("chat_app");
  this.element.querySelector(".window_icon").classList.add("chat_off");

  //add the menu
  var menu = this.element.querySelector(".window_menu");
  var alt = document.querySelector("#template_menu").content;
  var alt1 = alt.cloneNode(true);
  alt1.querySelector(".menu").appendChild(document.createTextNode("Clear History"));

  var alt2 = alt.cloneNode(true);
  alt2.querySelector(".menu").appendChild(document.createTextNode("Settings"));

  menu.appendChild(alt1);
  menu.appendChild(alt2);

  this.menuSettings();
};

/**
 * Function to destroy the application
 */
ChatApp.prototype.destroy = function()
{
  if (this.chat) // if there is a chat
  {
    this.chat.socket.close();
  }

  document.querySelector("#main_content").removeChild(this.element);
};

/**
 * Function to handle the menu-click
 * @param event
 */
ChatApp.prototype.menuClicked = function(event) {
  var target;
  if (event.target.tagName.toLowerCase() === "a")
  {
    target = event.target.textContent ;
  }

  if (target)
  {
    switch (target)
    {
      case "Settings":
      {
        this.menuSettings();
        break;
      }
      case "Clear History":
      {
        if (this.chat)
        {
          this.chat.clearHistory();
        }
        break;
      }
    }
  }
};

/**
 * Function to show the settings
 */
ChatApp.prototype.menuSettings = function()
{
  var i;
  var inputList;

  if (!this.settingsOpen)
  {
    //show the settings
    var template = document.querySelector("#template_settings").content.cloneNode(true);
    template.querySelector(".settings").classList.add("chat_settings");

    //get the settings
    template = this.addSettings(template);

    inputList =  template.querySelectorAll("input[type='text']");

    for (i = 0; i < inputList.length; i += 1)
    {
      inputList[i].addEventListener("focus", this.addFocusFunc);
      inputList[i].addEventListener("focusout", this.removeFocusFunc);
    }

    //append it
    this.element.querySelector(".window_content").appendChild(template);
    this.settingsOpen = true;
  }
  else
  {
    //settings showing. close the settings
    var settings = this.element.querySelector(".settings_wrapper");
    this.element.querySelector(".window_content").removeChild(settings);
    this.settingsOpen = false;
  }
};

/**
 * Function to add the settings
 * @param element - the element to append to
 * @returns {*} - the element
 */
ChatApp.prototype.addSettings = function(element) {
  var template = document.querySelector("#template_chat_settings").content.cloneNode(true);

  template.querySelector("input[name='username']").setAttribute("value", this.username);
  template.querySelector("input[name='server']").setAttribute("value", this.server);
  template.querySelector("input[name='channel']").setAttribute("value", this.channel);

  template.querySelector("input[type='button']").addEventListener("click", this.saveSettings.bind(this));

  element.querySelector(".settings").appendChild(template);
  return element;
};

/**
 * Function to save the settings and reopen chat with them
 */
ChatApp.prototype.saveSettings = function()
{
  //close the chat-connection
  if (this.chat)
  {
    this.chat.socket.close();
    this.chat.online = false;
  }

  var form = this.element.querySelector(".settings_form");

  //get the values from settings-form
  this.username = form.querySelector("input[name='username']").value;
  this.server = form.querySelector("input[name='server']").value;
  this.channel = form.querySelector("input[name='channel']").value;

  //show offline to the user
  this.element.querySelector(".window_icon").classList.remove("chat_on", "chat_connecting", "chat_off");
  this.element.querySelector(".window_icon").classList.add("chat_off");

  this.clearContentWindow();

  //start the new chat
  if (this.username === "")
  {
    this.username = "User";
  }

  //start the new chat
  this.chat = new Chat(this.element, this.server, this.channel, this.username);
  this.chat.start();
  this.settingsOpen = false;
  this.setFocus();

  //save the username to storage
  localStorage.setItem("username", this.username);
};

/**
 * Function to add focus to the window
 */
ChatApp.prototype.addFocus = function()
{
  if (!this.element.classList.contains("focused_window"))
  {
    this.element.classList.add("focused_window");
  }
};

/**
 * Function to remove focus from window
 */
ChatApp.prototype.removeFocus = function()
{
  if (this.element.classList.contains("focused_window"))
  {
    this.element.classList.remove("focused_window");
  }
};

/**
 * Function to set focus
 */
ChatApp.prototype.setFocus = function()
{
  this.element.classList.remove("focused_window");
  this.element.focus();
};

module.exports = ChatApp ;
