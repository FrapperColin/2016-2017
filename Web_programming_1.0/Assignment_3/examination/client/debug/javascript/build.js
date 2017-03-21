(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */


"use strict";

function Canvas(color, element)
{
  this.color = color ;
  this.element = element ;
}

Canvas.prototype.start = function()
{
  this.display();
  this.onload();
};


/**
 * Function to display the chat
 */
Canvas.prototype.display = function()
{
  console.log(this.element.querySelector(".window_content"));
  var template = document.querySelector("#template_canvas_app").content.cloneNode(true);
  console.log(template);
  this.element.appendChild(template);

};


Canvas.prototype.onload = function()
{
  var canvas = document.getElementById("myCanvas");

  if (!canvas)
  {
    alert("Impossible to get the canvas");
    return;
  }


  var context = canvas.getContext("2d");
  context.fillStyle=this.color; // apply the color

  if (!context)
  {
    alert("Impossible to get the context");
    return;
  }


  var diameterBall = 20;


  var posX = 1 + diameterBall / 2;

  var posY = 1 + diameterBall / 2;

  var speedX = 3;

  var speedY = 3;


  var myInterval = setInterval(animate, 1000 / 30);


  function animate()
  {

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    context.arc(posX, posY, diameterBall / 2, 0, Math.PI * 2);

    context.fill();


  // Check if the ball touch the bounds

    if (posX + diameterBall / 2 >= canvas.width || posX <= 0 + diameterBall / 2)//If we touch the left or right bound
    {
      speedX *= -1; //Inverse the speed
    }


    if (posY + diameterBall / 2 >= canvas.height || posY <= 0 + diameterBall / 2)//If we touch the bottom or up bound
    {
      speedY *= -1; //Inverse the speed
    }

    posX += speedX;
    posY += speedY;

  }
};

module.exports = Canvas;

},{}],2:[function(require,module,exports){
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

},{"../Window":11,"./Canvas":1}],3:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";

/**
 * Constructor
 * @param element
 * @param server
 * @param channel
 * @param username
 * @constructor
 */
function Chat(element, server, channel, username)
{
  this.element = element;
  this.server = server;
  this.channel = channel || "";
  this.username = username;
  this.socket = undefined;
  this.key = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
  this.online = false;
  this.messages = [];
}

/**
 * Function to init the basics
 */
Chat.prototype.start = function()
{
  this.display();

  //get the stored messages
  this.readStoredMessages();

  //connect
  this.connectToServer();

  //add listeners
  this.socket.addEventListener("message", this.newMessageFromServer.bind(this));
  this.element.querySelector(".chat_send").addEventListener("click", this.formSubmit.bind(this));
  this.element.querySelector("form").addEventListener("submit", this.formSubmit.bind(this));
  this.element.querySelector("form").addEventListener("focusout", this.toggleFocus.bind(this));
  this.element.querySelector(".chat_inputField").addEventListener("focus", this.toggleFocus.bind(this));
  this.element.querySelector(".chat_inputField").addEventListener("input", this.checkInput.bind(this));
  this.element.querySelector(".chat_send").addEventListener("focus", this.toggleFocus.bind(this));
};

/**
 * Function to display the chat
 */
Chat.prototype.display = function()
{
  var template = document.querySelector("#template_chat_app").content.cloneNode(true);
  this.element.querySelector(".window_content").appendChild(template);

};

/**
 * Function to connect to the server
 */
Chat.prototype.connectToServer = function()
{
  //change the classes to show whats happening
  this.element.querySelector(".window_icon").classList.remove("chat_off");
  this.element.querySelector(".window_icon").classList.add("chat_connecting");

  //start new websocket
  this.socket = new WebSocket(this.server, "charcords");

  //add listeners to the socket
  this.socket.addEventListener("open", this.setOnline.bind(this));
  this.socket.addEventListener("error", this.setOffline.bind(this));
};

//function to set chat offline if error
Chat.prototype.setOffline = function()
{
  this.element.querySelector(".window_icon").classList.remove("chat_connecting");
  this.element.querySelector(".window_icon").classList.add("chat_offline");
  this.online = false;

  var data =
  {
    username: "Fail",
    data: "Could not connect to server..."
  };
  this.displayNewMessage(data);
};

/**
 * Function to set chat online if connected
 */
Chat.prototype.setOnline = function()
{
  this.online = true;
  this.element.querySelector(".window_icon").classList.remove("chat_connecting");
  this.element.querySelector(".window_icon").classList.add("chat_on");
};

/**
 * Function to handle the messages from server
 * @param event - the datastring from server
 */
Chat.prototype.newMessageFromServer = function(event)
{
  var data = JSON.parse(event.data);
  if (data.type === "message")
  {
    if (!data.channel)
    {
      data.channel = "";
    }

    //check the channel
    if (data.channel === this.channel)
    {
      this.displayNewMessage(data);
      this.saveNewMessage(data); // save for this channel
    }
  }
};

/**
 * Function to submit a message
 * @param event - the event from form
 */
Chat.prototype.formSubmit = function(event)
{
  if (event)
  {
    event.preventDefault();
  }

  if (this.online)
  {
    //get the input from form
    var input = this.element.querySelector(".chat_inputField").value;

    if (input.length > 1)
    {
      //the message is at least one char, create object to send
      var msg =
      {
        type: "message",
        data: input,
        username: this.username,
        channel: this.channel,
        key: this.key
      };

      //send the object to server
      this.socket.send(JSON.stringify(msg));

      //disable the button and reset the form
      this.element.querySelector(".chat_send").setAttribute("disabled", "disabled");
      this.element.querySelector("form").reset();
    }
  }
};


/**
 * Function to print message to the window
 * @param data - the data-string to print
 */
Chat.prototype.displayNewMessage = function(data)
{
  var messageNode = this.parseMessage(data.data);

  var template = document.querySelector("#template_chat_message").content.cloneNode(true);
  var usernameNode = document.createTextNode(data.username + " : ");

  template.querySelector(".chat_message").appendChild(messageNode);


  if (this.username === data.username)
  {
    template.querySelector("li").classList.add("chat_bubble_me");
  }
  else
  {
    template.querySelector("li").classList.add("chat_bubble");
    template.querySelector(".chat_username").appendChild(usernameNode);
  }

  //append the new message
  this.element.querySelector(".chat_message_list ul").appendChild(template);

};

/**
 * Function to find and parse message
 * @param text - the message
 * @returns {*} - documentFragment to append as message
 */
Chat.prototype.parseMessage = function(text)
{
  var frag = document.createDocumentFragment();
  var textNode;

  //split message into words
  var words = text.split(" ");

  for (var i = 0; i < words.length; i++)
  {
      textNode = document.createTextNode(words[i] + " ");
      frag.appendChild(textNode);
  }
  return frag;
};

/**
 * Function to save the new message to local storage for history
 * @param data
 */
Chat.prototype.saveNewMessage = function(data)
{
  var newMsg =
  {
    username: data.username,
    data: data.data,
  };


  this.messages.push(newMsg); //add the new message to the array
  localStorage.setItem("chat_" + this.channel, JSON.stringify(this.messages)); // and save it
};

/**
 * Function to read the stored messages from local storage and print them
 */
Chat.prototype.readStoredMessages = function()
{
  if (localStorage.getItem("chat_" + this.channel))
  {
    var messages = localStorage.getItem("chat_" + this.channel);
    this.messages = JSON.parse(messages);

    //print all the messages from history
    for (var i = 0; i < this.messages.length; i += 1)
    {
      this.displayNewMessage(this.messages[i]);
    }

    //add end-of-history separator
    if (this.messages.length > 0)
    {
      var separator = document.querySelector("#template_chat_history").content.cloneNode(true);
      this.element.querySelector(".chat_message_list ul").appendChild(separator);
    }
  }
};

/**
 * Function to toggle the focus
 * needed since the window drops focus when form in window is focused
 */
Chat.prototype.toggleFocus = function()
{
  this.element.classList.toggle("focused_window");
};

/**
 * Function to check the input in textarea
 * @param event
 */
Chat.prototype.checkInput = function(event)
{
  //get the input
  var input = event.target.value;

  //handle that the button should only be clickable if input is one or more chars
  if (input.length > 0)
  {
    this.element.querySelector(".chat_send").removeAttribute("disabled");
  }
  else
  {
    this.element.querySelector(".chat_send").setAttribute("disabled", "disabled");
  }

  //check if the last char was enter, and submit
  if (input.charCodeAt(input.length - 1) === 10)
  {
    this.formSubmit();
  }

  if (input.charCodeAt(0) === 10)
  {
    //first char is enter, reset form and disable send-button
    this.element.querySelector("form").reset();
    this.element.querySelector(".chat_send").setAttribute("disabled", "disabled");
  }
};

/**
 * Function to clear the history
 */
Chat.prototype.clearHistory = function()
{
  //remove from storage and reset array
  localStorage.removeItem("chat_" + this.channel);
  this.messages = [];

  //remove elements from DOM
  var listElement = this.element.querySelector("ul");
  while (listElement.hasChildNodes())
  {
    listElement.removeChild(listElement.firstChild);
  }
};


module.exports = Chat ;

},{}],4:[function(require,module,exports){
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

},{"../Window":11,"./Chat":3}],5:[function(require,module,exports){
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

},{"./LauncherMenu":6}],6:[function(require,module,exports){
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

},{"./Canvas/CanvasApp":2,"./Chat/ChatApp":4,"./Memory/MemoryApp":7}],7:[function(require,module,exports){
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

},{"../Window":11,"./MemoryGame":10}],8:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";

/**
 * Constructor
 * @param id
 * @param img_number
 * @constructor
 */
function MemoryCard(id, img_number)
{
  this.id = id;
  this.img_number = img_number;
}

module.exports = MemoryCard;

},{}],9:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */
"use strict";

/**
 * Constructor
 * @param x
 * @param y
 * @param element
 * @constructor
 */
function MemoryContent(x, y, element)
{
  this.x = x;
  this.y = y;
  this.element = element;

  this.displayCards();
}

/**
 * Function to print the cards
 */
MemoryContent.prototype.displayCards = function()
{
  var frag = document.createDocumentFragment();

  var rowDiv;
  var cardDiv;

  for (var i = 0; i < this.y; i += 1)
  {
    rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (var j = 0; j < this.x; j += 1) // create a div for each card
    {
      cardDiv = document.createElement("div");
      cardDiv.classList.add("card-" + i + j, "card");
      rowDiv.appendChild(cardDiv);
    }
    frag.appendChild(rowDiv);
  }

  this.element.appendChild(frag);
};

module.exports = MemoryContent ;

},{}],10:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";

var MemoryContent = require("./MemoryContent");
var MemoryCard = require("./MemoryCard");

/**
 * Constructor
 * @param x
 * @param y
 * @param element
 * @constructor
 */
function MemoryGame(x, y, element)
{
  this.element = element;
  this.x = x;
  this.y = y;
  this.layout = new MemoryContent(this.x, this.y, element);
  this.board = []; // array for the game
  this.visibleCards = []; // array to get the visible card
  this.turns = 0; // the number of the turn
  this.correctCount = 0;
  this.imageList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  this.images = this.imageList.slice(0, (this.y * this.x));
  this.clickFunc = this.click.bind(this);

  //shuffle and add eventlisteners
  this.shuffle();
  this.addEvents();
}

/**
 * Init the game
 */
MemoryGame.prototype.start = function()
{
  var i = 0;


  this.board = []; //init the empty board-array
  if (this.x > this.y)
  {
    for (i = 0; i < this.x; i += 1) // create the dimension of array
    {
      this.board.push(new Array(this.y));
    }
  }
  else
  {
    for (i = 0; i < this.y; i += 1) // create the dimension of array
    {
      this.board.push(new Array(this.x));
    }
  }

  this.visibleCards = [];

  for (i = 0; i < this.y; i += 1)   //push new cards to the board-array
  {
    for (var j = 0; j < this.x - 1; j += 2)
    {
      this.board[i][j] = new MemoryCard("" + i + j, this.images.pop()); // create the cards
      this.board[i][j + 1] = new MemoryCard("" + i + (j + 1), this.images.pop()); // create the cards
    }
  }
};

/**
 * Function to shuffle the images-array
 */
MemoryGame.prototype.shuffle = function()
{
  var temp;
  var rand;
  for (var i = 0; i < this.images.length; i += 1)
  {
    temp = this.images[i];
    rand = Math.floor(Math.random() * this.images.length);
    this.images[i] = this.images[rand];
    this.images[rand] = temp;
  }
};


/**
 * Function to add the events needed
 */
MemoryGame.prototype.addEvents = function()
{
  this.element.addEventListener("click", this.clickFunc);
};

/**
 * Function to remove the events
 */
MemoryGame.prototype.removeEvents = function()
{
  this.element.removeEventListener("click", this.clickFunc);
};

/**
 * Function to handle the clicks
 * @param event - the click-event
 */
MemoryGame.prototype.click = function(event)
{
  this.turnCard(event.target);
};

/**
 * Function to turn the given carde
 * @param element - the card to turn
 */
MemoryGame.prototype.turnCard = function(element)
{
  if (this.visibleCards.length < 2 && !element.classList.contains("disable")) // if we didn't turned 2 cards and the card not already turned
  {
    if (element.classList.contains("card"))
    {
      var yx = element.classList[0].split("-")[1];
      var y = yx.charAt(0);
      var x = yx.charAt(1);


      element.classList.add("img-" + this.board[y][x].img_number); //add classes to show the card
      element.classList.add("img");

      this.visibleCards.push(this.board[y][x]);

      //disable the card that got clicked
      this.element.querySelector(".card-" + this.board[y][x].id).classList.add("disable");

      if (this.visibleCards.length === 2)
      {
        this.checkCorrect(); // check if it's the same cards
      }
    }
  }
};

/**
* Function to check if the pair is the same
*/
MemoryGame.prototype.checkCorrect = function()
{
  this.turns += 1;
  if (this.visibleCards[0].img_number === this.visibleCards[1].img_number)
  {
    //it was the same image, show it to the user
    this.element.querySelector(".card-" + this.visibleCards[0].id).classList.add("show"); // right
    this.element.querySelector(".card-" + this.visibleCards[1].id).classList.add("show"); // right

    //reset the visible-cards array
    this.visibleCards = [];

    this.correctCount += 1;

    if (this.correctCount === (this.x * this.y / 2))
    {
      //the game is over since the correctcount is the amount of cards
      this.gameOver();
    }
  }
  else
  {
    //it was not correct, set the classes
    for (var i = 0; i < this.visibleCards.length; i += 1)
    {
      this.element.querySelector(".card-" + this.visibleCards[i].id).classList.add("wrong");
      this.element.querySelector(".card-" + this.visibleCards[i].id).classList.remove("disable");
    }

    //turn back the cards
    setTimeout(this.turnBackCards.bind(this), 1000);
  }
};

/**
 * Function to turn back cards when wrong
 */
MemoryGame.prototype.turnBackCards = function()
{
  var tempCard;
  for (var i = 0; i < this.visibleCards.length; i += 1)
  {
    tempCard = this.visibleCards[i];
    this.element.querySelector(".card-" + tempCard.id).classList.remove("wrong", "img", "img-" + tempCard.img_number);
  }

  this.visibleCards = [];
};

/**
 * Function to show the game over
 */
MemoryGame.prototype.gameOver = function()
{
  var template = document.querySelector("#template_memory_gameover").content.cloneNode(true);
  template.querySelector(".memory_turns").appendChild(document.createTextNode(this.turns));
  this.element.appendChild(template);
};

module.exports = MemoryGame;

},{"./MemoryCard":8,"./MemoryContent":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
/**
 * Created by Colin Frapper
 * 23/10/2016
 */


"use strict";

var Desktop = require("./Desktop");

var desktop = new Desktop();
desktop.start(); // start the desktop

},{"./Desktop":5}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2FudmFzL0NhbnZhcy5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2FudmFzL0NhbnZhc0FwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9DaGF0L0NoYXRBcHAuanMiLCJjbGllbnQvc291cmNlL2pzL0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL0xhdW5jaGVyTWVudS5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5L01lbW9yeUFwcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5L01lbW9yeUNhcmQuanMiLCJjbGllbnQvc291cmNlL2pzL01lbW9yeS9NZW1vcnlDb250ZW50LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkvTWVtb3J5R2FtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIENhbnZhcyhjb2xvciwgZWxlbWVudClcbntcbiAgdGhpcy5jb2xvciA9IGNvbG9yIDtcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudCA7XG59XG5cbkNhbnZhcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZGlzcGxheSgpO1xuICB0aGlzLm9ubG9hZCgpO1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGNoYXRcbiAqL1xuQ2FudmFzLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24oKVxue1xuICBjb25zb2xlLmxvZyh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKSk7XG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfY2FudmFzX2FwcFwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgY29uc29sZS5sb2codGVtcGxhdGUpO1xuICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuXG59O1xuXG5cbkNhbnZhcy5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24oKVxue1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcblxuICBpZiAoIWNhbnZhcylcbiAge1xuICAgIGFsZXJ0KFwiSW1wb3NzaWJsZSB0byBnZXQgdGhlIGNhbnZhc1wiKTtcbiAgICByZXR1cm47XG4gIH1cblxuXG4gIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgY29udGV4dC5maWxsU3R5bGU9dGhpcy5jb2xvcjsgLy8gYXBwbHkgdGhlIGNvbG9yXG5cbiAgaWYgKCFjb250ZXh0KVxuICB7XG4gICAgYWxlcnQoXCJJbXBvc3NpYmxlIHRvIGdldCB0aGUgY29udGV4dFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuXG4gIHZhciBkaWFtZXRlckJhbGwgPSAyMDtcblxuXG4gIHZhciBwb3NYID0gMSArIGRpYW1ldGVyQmFsbCAvIDI7XG5cbiAgdmFyIHBvc1kgPSAxICsgZGlhbWV0ZXJCYWxsIC8gMjtcblxuICB2YXIgc3BlZWRYID0gMztcblxuICB2YXIgc3BlZWRZID0gMztcblxuXG4gIHZhciBteUludGVydmFsID0gc2V0SW50ZXJ2YWwoYW5pbWF0ZSwgMTAwMCAvIDMwKTtcblxuXG4gIGZ1bmN0aW9uIGFuaW1hdGUoKVxuICB7XG5cbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGNvbnRleHQuYXJjKHBvc1gsIHBvc1ksIGRpYW1ldGVyQmFsbCAvIDIsIDAsIE1hdGguUEkgKiAyKTtcblxuICAgIGNvbnRleHQuZmlsbCgpO1xuXG5cbiAgLy8gQ2hlY2sgaWYgdGhlIGJhbGwgdG91Y2ggdGhlIGJvdW5kc1xuXG4gICAgaWYgKHBvc1ggKyBkaWFtZXRlckJhbGwgLyAyID49IGNhbnZhcy53aWR0aCB8fCBwb3NYIDw9IDAgKyBkaWFtZXRlckJhbGwgLyAyKS8vSWYgd2UgdG91Y2ggdGhlIGxlZnQgb3IgcmlnaHQgYm91bmRcbiAgICB7XG4gICAgICBzcGVlZFggKj0gLTE7IC8vSW52ZXJzZSB0aGUgc3BlZWRcbiAgICB9XG5cblxuICAgIGlmIChwb3NZICsgZGlhbWV0ZXJCYWxsIC8gMiA+PSBjYW52YXMuaGVpZ2h0IHx8IHBvc1kgPD0gMCArIGRpYW1ldGVyQmFsbCAvIDIpLy9JZiB3ZSB0b3VjaCB0aGUgYm90dG9tIG9yIHVwIGJvdW5kXG4gICAge1xuICAgICAgc3BlZWRZICo9IC0xOyAvL0ludmVyc2UgdGhlIHNwZWVkXG4gICAgfVxuXG4gICAgcG9zWCArPSBzcGVlZFg7XG4gICAgcG9zWSArPSBzcGVlZFk7XG5cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXaW5kb3cgPSByZXF1aXJlKFwiLi4vV2luZG93XCIpO1xudmFyIENhbnZhcyA9IHJlcXVpcmUoXCIuL0NhbnZhc1wiKTtcblxuXG5mdW5jdGlvbiBDYW52YXNBcHAob3B0aW9ucylcbntcbiAgV2luZG93LmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIHRoaXMuc2V0dGluZ3NPcGVuID0gZmFsc2U7XG4gIHRoaXMuZHJhdyA9IHVuZGVmaW5lZCA7XG5cbn1cblxuQ2FudmFzQXBwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoV2luZG93LnByb3RvdHlwZSk7IC8vIGluaGVyaXRhbmNlXG5DYW52YXNBcHAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gIENhbnZhc0FwcDtcblxuXG5DYW52YXNBcHAucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKClcbntcbiAgdGhpcy5kaXNwbGF5KCk7XG5cbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X21lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMubWVudUNsaWNrZWQuYmluZCh0aGlzKSk7XG5cblxuICAvL2NyZWF0ZSBuZXcgZ2FtZSBhbmQgaW5pdCBpdFxuICB0aGlzLmRyYXcgPSBuZXcgQ2FudmFzKFwiYmxhY2tcIix0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKSk7XG4gIHRoaXMuZHJhdy5zdGFydCgpO1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGFwcGxpY2F0aW9uXG4gKi9cbkNhbnZhc0FwcC5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uKClcbntcbiAgV2luZG93LnByb3RvdHlwZS5kaXNwbGF5LmNhbGwodGhpcyk7XG4gIGNvbnNvbGUubG9nKHRoaXMuZWxlbWVudCk7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY2FudmFzX2FwcFwiKTtcblxuICB2YXIgbWVudSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19tZW51XCIpO1xuICB2YXIgYWx0MSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfbWVudVwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgYWx0MS5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIikuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJTZXR0aW5nc1wiKSk7XG5cbiAgbWVudS5hcHBlbmRDaGlsZChhbHQxKTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBtZW51LWNsaWNrZWRcbiAqIEBwYXJhbSBldmVudCAtIGNsaWNrLWV2ZW50XG4gKi9cbkNhbnZhc0FwcC5wcm90b3R5cGUubWVudUNsaWNrZWQgPSBmdW5jdGlvbihldmVudClcbntcbiAgdmFyIHRhcmdldDtcbiAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYVwiKSAgLy8gaWYgd2UgY2xpY2tlZCBvbiB0aGUgb25lIG9mIHRoZSBhIHRhZyBtZW51XG4gIHtcbiAgICB0YXJnZXQgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQgO1xuICB9XG5cbiAgaWYgKHRhcmdldClcbiAge1xuICAgIGlmKHRhcmdldCA9PT0gXCJTZXR0aW5nc1wiKVxuICAgIHtcbiAgICAgICAgdGhpcy5tZW51U2V0dGluZ3MoKTsgLy8gZGlzcGxheSBzZXR0aW5nc1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBzaG93L2hpZGUgdGhlIHNldHRpbmdzXG4gKi9cbkNhbnZhc0FwcC5wcm90b3R5cGUubWVudVNldHRpbmdzID0gZnVuY3Rpb24oKVxue1xuICBpZiAoIXRoaXMuc2V0dGluZ3NPcGVuKVxuICB7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV9zZXR0aW5nc1wiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzXCIpLmNsYXNzTGlzdC5hZGQoXCJtZW1vcnlfc2V0dGluZ3NcIik7XG5cbiAgICB0ZW1wbGF0ZSA9IHRoaXMuYWRkU2V0dGluZ3ModGVtcGxhdGUpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19jb250ZW50XCIpLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICB0aGlzLnNldHRpbmdzT3BlbiA9IHRydWU7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgLy9oaWRlIHRoZSBzZXR0aW5nc1xuICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzX3dyYXBwZXJcIik7XG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2NvbnRlbnRcIikucmVtb3ZlQ2hpbGQoc2V0dGluZ3MpO1xuICAgIHRoaXMuc2V0dGluZ3NPcGVuID0gZmFsc2U7XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gYWRkIHRoZSBzZXR0aW5nc1xuICogQHBhcmFtIGVsZW1lbnQgLSB0aGUgZWxlbWVudFxuICogQHJldHVybnMgeyp9IC0gdGhlIGVsZW1lbnRcbiAqL1xuQ2FudmFzQXBwLnByb3RvdHlwZS5hZGRTZXR0aW5ncyA9IGZ1bmN0aW9uKGVsZW1lbnQpXG57XG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfY2FudmFzX3NldHRpbmdzXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gIGVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR0aW5nc1wiKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG4gIGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2J1dHRvbiddXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnNhdmVTZXR0aW5ncy5iaW5kKHRoaXMpKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNhdmUgdGhlIHNldHRpbmdzIGFuZCBydW4gbmV3IGdhbWVcbiAqL1xuQ2FudmFzQXBwLnByb3RvdHlwZS5zYXZlU2V0dGluZ3MgPSBmdW5jdGlvbigpXG57XG4gIHZhciB2YWx1ZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwic2VsZWN0W25hbWU9J2NvbG9yJ11cIikudmFsdWU7XG5cbiAgLy9yZXN0YXJ0IHdpdGggdGhlIG5ldyBzZXR0aW5nc1xuICB0aGlzLnJlc3RhcnQodmFsdWUpO1xuICB0aGlzLnNldHRpbmdzT3BlbiA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byByZXN0YXJ0IHRoZSBnYW1lXG4gKiBAcGFyYW0gdmFsdWUgLSB0aGUgY29sb3JcbiAqL1xuQ2FudmFzQXBwLnByb3RvdHlwZS5yZXN0YXJ0ID0gZnVuY3Rpb24odmFsdWUpXG57XG4gIC8vY2xlYXIgdGhlIGNvbnRlbnRcbiAgdGhpcy5jbGVhckNvbnRlbnRXaW5kb3coKTtcblxuICAvL2NyZWF0ZSBuZXcgZHJhdyBhbmQgc3RhcnQgaXRcbiAgdGhpcy5kcmF3ID0gbmV3IENhbnZhcyh2YWx1ZSx0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKSk7XG4gIHRoaXMuZHJhdy5zdGFydCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhc0FwcCA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIHNlcnZlclxuICogQHBhcmFtIGNoYW5uZWxcbiAqIEBwYXJhbSB1c2VybmFtZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIENoYXQoZWxlbWVudCwgc2VydmVyLCBjaGFubmVsLCB1c2VybmFtZSlcbntcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWwgfHwgXCJcIjtcbiAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICB0aGlzLnNvY2tldCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5rZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gIHRoaXMub25saW5lID0gZmFsc2U7XG4gIHRoaXMubWVzc2FnZXMgPSBbXTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbml0IHRoZSBiYXNpY3NcbiAqL1xuQ2hhdC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZGlzcGxheSgpO1xuXG4gIC8vZ2V0IHRoZSBzdG9yZWQgbWVzc2FnZXNcbiAgdGhpcy5yZWFkU3RvcmVkTWVzc2FnZXMoKTtcblxuICAvL2Nvbm5lY3RcbiAgdGhpcy5jb25uZWN0VG9TZXJ2ZXIoKTtcblxuICAvL2FkZCBsaXN0ZW5lcnNcbiAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgdGhpcy5uZXdNZXNzYWdlRnJvbVNlcnZlci5iaW5kKHRoaXMpKTtcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdF9zZW5kXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmZvcm1TdWJtaXQuYmluZCh0aGlzKSk7XG4gIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHRoaXMuZm9ybVN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCB0aGlzLnRvZ2dsZUZvY3VzLmJpbmQodGhpcykpO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0X2lucHV0RmllbGRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMudG9nZ2xlRm9jdXMuYmluZCh0aGlzKSk7XG4gIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRfaW5wdXRGaWVsZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdGhpcy5jaGVja0lucHV0LmJpbmQodGhpcykpO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0X3NlbmRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHRoaXMudG9nZ2xlRm9jdXMuYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGRpc3BsYXkgdGhlIGNoYXRcbiAqL1xuQ2hhdC5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV9jaGF0X2FwcFwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuXG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlclxuICovXG5DaGF0LnByb3RvdHlwZS5jb25uZWN0VG9TZXJ2ZXIgPSBmdW5jdGlvbigpXG57XG4gIC8vY2hhbmdlIHRoZSBjbGFzc2VzIHRvIHNob3cgd2hhdHMgaGFwcGVuaW5nXG4gIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19pY29uXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJjaGF0X29mZlwiKTtcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2ljb25cIikuY2xhc3NMaXN0LmFkZChcImNoYXRfY29ubmVjdGluZ1wiKTtcblxuICAvL3N0YXJ0IG5ldyB3ZWJzb2NrZXRcbiAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMuc2VydmVyLCBcImNoYXJjb3Jkc1wiKTtcblxuICAvL2FkZCBsaXN0ZW5lcnMgdG8gdGhlIHNvY2tldFxuICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCB0aGlzLnNldE9ubGluZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIHRoaXMuc2V0T2ZmbGluZS5iaW5kKHRoaXMpKTtcbn07XG5cbi8vZnVuY3Rpb24gdG8gc2V0IGNoYXQgb2ZmbGluZSBpZiBlcnJvclxuQ2hhdC5wcm90b3R5cGUuc2V0T2ZmbGluZSA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2ljb25cIikuY2xhc3NMaXN0LnJlbW92ZShcImNoYXRfY29ubmVjdGluZ1wiKTtcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2ljb25cIikuY2xhc3NMaXN0LmFkZChcImNoYXRfb2ZmbGluZVwiKTtcbiAgdGhpcy5vbmxpbmUgPSBmYWxzZTtcblxuICB2YXIgZGF0YSA9XG4gIHtcbiAgICB1c2VybmFtZTogXCJGYWlsXCIsXG4gICAgZGF0YTogXCJDb3VsZCBub3QgY29ubmVjdCB0byBzZXJ2ZXIuLi5cIlxuICB9O1xuICB0aGlzLmRpc3BsYXlOZXdNZXNzYWdlKGRhdGEpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBzZXQgY2hhdCBvbmxpbmUgaWYgY29ubmVjdGVkXG4gKi9cbkNoYXQucHJvdG90eXBlLnNldE9ubGluZSA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5vbmxpbmUgPSB0cnVlO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfaWNvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhdF9jb25uZWN0aW5nXCIpO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfaWNvblwiKS5jbGFzc0xpc3QuYWRkKFwiY2hhdF9vblwiKTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBtZXNzYWdlcyBmcm9tIHNlcnZlclxuICogQHBhcmFtIGV2ZW50IC0gdGhlIGRhdGFzdHJpbmcgZnJvbSBzZXJ2ZXJcbiAqL1xuQ2hhdC5wcm90b3R5cGUubmV3TWVzc2FnZUZyb21TZXJ2ZXIgPSBmdW5jdGlvbihldmVudClcbntcbiAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICBpZiAoZGF0YS50eXBlID09PSBcIm1lc3NhZ2VcIilcbiAge1xuICAgIGlmICghZGF0YS5jaGFubmVsKVxuICAgIHtcbiAgICAgIGRhdGEuY2hhbm5lbCA9IFwiXCI7XG4gICAgfVxuXG4gICAgLy9jaGVjayB0aGUgY2hhbm5lbFxuICAgIGlmIChkYXRhLmNoYW5uZWwgPT09IHRoaXMuY2hhbm5lbClcbiAgICB7XG4gICAgICB0aGlzLmRpc3BsYXlOZXdNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5zYXZlTmV3TWVzc2FnZShkYXRhKTsgLy8gc2F2ZSBmb3IgdGhpcyBjaGFubmVsXG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHN1Ym1pdCBhIG1lc3NhZ2VcbiAqIEBwYXJhbSBldmVudCAtIHRoZSBldmVudCBmcm9tIGZvcm1cbiAqL1xuQ2hhdC5wcm90b3R5cGUuZm9ybVN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KVxue1xuICBpZiAoZXZlbnQpXG4gIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgaWYgKHRoaXMub25saW5lKVxuICB7XG4gICAgLy9nZXQgdGhlIGlucHV0IGZyb20gZm9ybVxuICAgIHZhciBpbnB1dCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRfaW5wdXRGaWVsZFwiKS52YWx1ZTtcblxuICAgIGlmIChpbnB1dC5sZW5ndGggPiAxKVxuICAgIHtcbiAgICAgIC8vdGhlIG1lc3NhZ2UgaXMgYXQgbGVhc3Qgb25lIGNoYXIsIGNyZWF0ZSBvYmplY3QgdG8gc2VuZFxuICAgICAgdmFyIG1zZyA9XG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiBpbnB1dCxcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcbiAgICAgICAga2V5OiB0aGlzLmtleVxuICAgICAgfTtcblxuICAgICAgLy9zZW5kIHRoZSBvYmplY3QgdG8gc2VydmVyXG4gICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXG4gICAgICAvL2Rpc2FibGUgdGhlIGJ1dHRvbiBhbmQgcmVzZXQgdGhlIGZvcm1cbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRfc2VuZFwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpLnJlc2V0KCk7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogRnVuY3Rpb24gdG8gcHJpbnQgbWVzc2FnZSB0byB0aGUgd2luZG93XG4gKiBAcGFyYW0gZGF0YSAtIHRoZSBkYXRhLXN0cmluZyB0byBwcmludFxuICovXG5DaGF0LnByb3RvdHlwZS5kaXNwbGF5TmV3TWVzc2FnZSA9IGZ1bmN0aW9uKGRhdGEpXG57XG4gIHZhciBtZXNzYWdlTm9kZSA9IHRoaXMucGFyc2VNZXNzYWdlKGRhdGEuZGF0YSk7XG5cbiAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV9jaGF0X21lc3NhZ2VcIikuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gIHZhciB1c2VybmFtZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhLnVzZXJuYW1lICsgXCIgOiBcIik7XG5cbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5jaGF0X21lc3NhZ2VcIikuYXBwZW5kQ2hpbGQobWVzc2FnZU5vZGUpO1xuXG5cbiAgaWYgKHRoaXMudXNlcm5hbWUgPT09IGRhdGEudXNlcm5hbWUpXG4gIHtcbiAgICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwibGlcIikuY2xhc3NMaXN0LmFkZChcImNoYXRfYnViYmxlX21lXCIpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJsaVwiKS5jbGFzc0xpc3QuYWRkKFwiY2hhdF9idWJibGVcIik7XG4gICAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5jaGF0X3VzZXJuYW1lXCIpLmFwcGVuZENoaWxkKHVzZXJuYW1lTm9kZSk7XG4gIH1cblxuICAvL2FwcGVuZCB0aGUgbmV3IG1lc3NhZ2VcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdF9tZXNzYWdlX2xpc3QgdWxcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuXG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGZpbmQgYW5kIHBhcnNlIG1lc3NhZ2VcbiAqIEBwYXJhbSB0ZXh0IC0gdGhlIG1lc3NhZ2VcbiAqIEByZXR1cm5zIHsqfSAtIGRvY3VtZW50RnJhZ21lbnQgdG8gYXBwZW5kIGFzIG1lc3NhZ2VcbiAqL1xuQ2hhdC5wcm90b3R5cGUucGFyc2VNZXNzYWdlID0gZnVuY3Rpb24odGV4dClcbntcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciB0ZXh0Tm9kZTtcblxuICAvL3NwbGl0IG1lc3NhZ2UgaW50byB3b3Jkc1xuICB2YXIgd29yZHMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgICB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHdvcmRzW2ldICsgXCIgXCIpO1xuICAgICAgZnJhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gIH1cbiAgcmV0dXJuIGZyYWc7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNhdmUgdGhlIG5ldyBtZXNzYWdlIHRvIGxvY2FsIHN0b3JhZ2UgZm9yIGhpc3RvcnlcbiAqIEBwYXJhbSBkYXRhXG4gKi9cbkNoYXQucHJvdG90eXBlLnNhdmVOZXdNZXNzYWdlID0gZnVuY3Rpb24oZGF0YSlcbntcbiAgdmFyIG5ld01zZyA9XG4gIHtcbiAgICB1c2VybmFtZTogZGF0YS51c2VybmFtZSxcbiAgICBkYXRhOiBkYXRhLmRhdGEsXG4gIH07XG5cblxuICB0aGlzLm1lc3NhZ2VzLnB1c2gobmV3TXNnKTsgLy9hZGQgdGhlIG5ldyBtZXNzYWdlIHRvIHRoZSBhcnJheVxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNoYXRfXCIgKyB0aGlzLmNoYW5uZWwsIEpTT04uc3RyaW5naWZ5KHRoaXMubWVzc2FnZXMpKTsgLy8gYW5kIHNhdmUgaXRcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gcmVhZCB0aGUgc3RvcmVkIG1lc3NhZ2VzIGZyb20gbG9jYWwgc3RvcmFnZSBhbmQgcHJpbnQgdGhlbVxuICovXG5DaGF0LnByb3RvdHlwZS5yZWFkU3RvcmVkTWVzc2FnZXMgPSBmdW5jdGlvbigpXG57XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNoYXRfXCIgKyB0aGlzLmNoYW5uZWwpKVxuICB7XG4gICAgdmFyIG1lc3NhZ2VzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjaGF0X1wiICsgdGhpcy5jaGFubmVsKTtcbiAgICB0aGlzLm1lc3NhZ2VzID0gSlNPTi5wYXJzZShtZXNzYWdlcyk7XG5cbiAgICAvL3ByaW50IGFsbCB0aGUgbWVzc2FnZXMgZnJvbSBoaXN0b3J5XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1lc3NhZ2VzLmxlbmd0aDsgaSArPSAxKVxuICAgIHtcbiAgICAgIHRoaXMuZGlzcGxheU5ld01lc3NhZ2UodGhpcy5tZXNzYWdlc1tpXSk7XG4gICAgfVxuXG4gICAgLy9hZGQgZW5kLW9mLWhpc3Rvcnkgc2VwYXJhdG9yXG4gICAgaWYgKHRoaXMubWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICB2YXIgc2VwYXJhdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV9jaGF0X2hpc3RvcnlcIikuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0X21lc3NhZ2VfbGlzdCB1bFwiKS5hcHBlbmRDaGlsZChzZXBhcmF0b3IpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byB0b2dnbGUgdGhlIGZvY3VzXG4gKiBuZWVkZWQgc2luY2UgdGhlIHdpbmRvdyBkcm9wcyBmb2N1cyB3aGVuIGZvcm0gaW4gd2luZG93IGlzIGZvY3VzZWRcbiAqL1xuQ2hhdC5wcm90b3R5cGUudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZm9jdXNlZF93aW5kb3dcIik7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGNoZWNrIHRoZSBpbnB1dCBpbiB0ZXh0YXJlYVxuICogQHBhcmFtIGV2ZW50XG4gKi9cbkNoYXQucHJvdG90eXBlLmNoZWNrSW5wdXQgPSBmdW5jdGlvbihldmVudClcbntcbiAgLy9nZXQgdGhlIGlucHV0XG4gIHZhciBpbnB1dCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAvL2hhbmRsZSB0aGF0IHRoZSBidXR0b24gc2hvdWxkIG9ubHkgYmUgY2xpY2thYmxlIGlmIGlucHV0IGlzIG9uZSBvciBtb3JlIGNoYXJzXG4gIGlmIChpbnB1dC5sZW5ndGggPiAwKVxuICB7XG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdF9zZW5kXCIpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRfc2VuZFwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICB9XG5cbiAgLy9jaGVjayBpZiB0aGUgbGFzdCBjaGFyIHdhcyBlbnRlciwgYW5kIHN1Ym1pdFxuICBpZiAoaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSA9PT0gMTApXG4gIHtcbiAgICB0aGlzLmZvcm1TdWJtaXQoKTtcbiAgfVxuXG4gIGlmIChpbnB1dC5jaGFyQ29kZUF0KDApID09PSAxMClcbiAge1xuICAgIC8vZmlyc3QgY2hhciBpcyBlbnRlciwgcmVzZXQgZm9ybSBhbmQgZGlzYWJsZSBzZW5kLWJ1dHRvblxuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKS5yZXNldCgpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRfc2VuZFwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGNsZWFyIHRoZSBoaXN0b3J5XG4gKi9cbkNoYXQucHJvdG90eXBlLmNsZWFySGlzdG9yeSA9IGZ1bmN0aW9uKClcbntcbiAgLy9yZW1vdmUgZnJvbSBzdG9yYWdlIGFuZCByZXNldCBhcnJheVxuICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImNoYXRfXCIgKyB0aGlzLmNoYW5uZWwpO1xuICB0aGlzLm1lc3NhZ2VzID0gW107XG5cbiAgLy9yZW1vdmUgZWxlbWVudHMgZnJvbSBET01cbiAgdmFyIGxpc3RFbGVtZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcbiAgd2hpbGUgKGxpc3RFbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSlcbiAge1xuICAgIGxpc3RFbGVtZW50LnJlbW92ZUNoaWxkKGxpc3RFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdCA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblwidXNlIHN0cmljdFwiO1xudmFyIFdpbmRvdyA9IHJlcXVpcmUoXCIuLi9XaW5kb3dcIik7XG52YXIgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXRcIik7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQ2hhdEFwcChvcHRpb25zKVxue1xuICBXaW5kb3cuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgdGhpcy5jaGF0ID0gdW5kZWZpbmVkO1xuICB0aGlzLnNldHRpbmdzT3BlbiA9IGZhbHNlO1xuICB0aGlzLnVzZXJuYW1lID0gXCJcIjtcbiAgdGhpcy5zZXJ2ZXIgPSBcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCI7XG4gIHRoaXMuY2hhbm5lbCA9IFwiXCI7XG5cbiAgdGhpcy5hZGRGb2N1c0Z1bmMgPSB0aGlzLmFkZEZvY3VzLmJpbmQodGhpcyk7XG4gIHRoaXMucmVtb3ZlRm9jdXNGdW5jID0gdGhpcy5yZW1vdmVGb2N1cy5iaW5kKHRoaXMpO1xufVxuXG5cbkNoYXRBcHAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShXaW5kb3cucHJvdG90eXBlKTtcbkNoYXRBcHAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gIENoYXRBcHA7XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gc3RhcnQgdGhlIGJhc2ljc1xuICovXG5DaGF0QXBwLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKClcbntcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIikpIC8vIGlmIHdlIGhhZCBiZWVuIGNvbm5lY3RlZCBiZWZvcmVcbiAge1xuICAgIHRoaXMudXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpO1xuICB9XG5cbiAgdGhpcy5kaXNwbGF5KCk7XG5cbiAgLy9hZGQgbGlzdGVuZXIgdG8gdGhlIG1lbnVcbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X21lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMubWVudUNsaWNrZWQuYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiogRnVuY3Rpb24gdG8gZGlzcGxheSB0aGUgYXBwbGljYXRpb25cbiovXG5DaGF0QXBwLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24oKVxue1xuICBXaW5kb3cucHJvdG90eXBlLmRpc3BsYXkuY2FsbCh0aGlzKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNoYXRfYXBwXCIpO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfaWNvblwiKS5jbGFzc0xpc3QuYWRkKFwiY2hhdF9vZmZcIik7XG5cbiAgLy9hZGQgdGhlIG1lbnVcbiAgdmFyIG1lbnUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfbWVudVwiKTtcbiAgdmFyIGFsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfbWVudVwiKS5jb250ZW50O1xuICB2YXIgYWx0MSA9IGFsdC5jbG9uZU5vZGUodHJ1ZSk7XG4gIGFsdDEucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiQ2xlYXIgSGlzdG9yeVwiKSk7XG5cbiAgdmFyIGFsdDIgPSBhbHQuY2xvbmVOb2RlKHRydWUpO1xuICBhbHQyLnF1ZXJ5U2VsZWN0b3IoXCIubWVudVwiKS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlNldHRpbmdzXCIpKTtcblxuICBtZW51LmFwcGVuZENoaWxkKGFsdDEpO1xuICBtZW51LmFwcGVuZENoaWxkKGFsdDIpO1xuXG4gIHRoaXMubWVudVNldHRpbmdzKCk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGRlc3Ryb3kgdGhlIGFwcGxpY2F0aW9uXG4gKi9cbkNoYXRBcHAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpXG57XG4gIGlmICh0aGlzLmNoYXQpIC8vIGlmIHRoZXJlIGlzIGEgY2hhdFxuICB7XG4gICAgdGhpcy5jaGF0LnNvY2tldC5jbG9zZSgpO1xuICB9XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluX2NvbnRlbnRcIikucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBtZW51LWNsaWNrXG4gKiBAcGFyYW0gZXZlbnRcbiAqL1xuQ2hhdEFwcC5wcm90b3R5cGUubWVudUNsaWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xuICB2YXIgdGFyZ2V0O1xuICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIpXG4gIHtcbiAgICB0YXJnZXQgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQgO1xuICB9XG5cbiAgaWYgKHRhcmdldClcbiAge1xuICAgIHN3aXRjaCAodGFyZ2V0KVxuICAgIHtcbiAgICAgIGNhc2UgXCJTZXR0aW5nc1wiOlxuICAgICAge1xuICAgICAgICB0aGlzLm1lbnVTZXR0aW5ncygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJDbGVhciBIaXN0b3J5XCI6XG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLmNoYXQpXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLmNoYXQuY2xlYXJIaXN0b3J5KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNob3cgdGhlIHNldHRpbmdzXG4gKi9cbkNoYXRBcHAucHJvdG90eXBlLm1lbnVTZXR0aW5ncyA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGk7XG4gIHZhciBpbnB1dExpc3Q7XG5cbiAgaWYgKCF0aGlzLnNldHRpbmdzT3BlbilcbiAge1xuICAgIC8vc2hvdyB0aGUgc2V0dGluZ3NcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX3NldHRpbmdzXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3NcIikuY2xhc3NMaXN0LmFkZChcImNoYXRfc2V0dGluZ3NcIik7XG5cbiAgICAvL2dldCB0aGUgc2V0dGluZ3NcbiAgICB0ZW1wbGF0ZSA9IHRoaXMuYWRkU2V0dGluZ3ModGVtcGxhdGUpO1xuXG4gICAgaW5wdXRMaXN0ID0gIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRMaXN0Lmxlbmd0aDsgaSArPSAxKVxuICAgIHtcbiAgICAgIGlucHV0TGlzdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5hZGRGb2N1c0Z1bmMpO1xuICAgICAgaW5wdXRMaXN0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCB0aGlzLnJlbW92ZUZvY3VzRnVuYyk7XG4gICAgfVxuXG4gICAgLy9hcHBlbmQgaXRcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG4gICAgdGhpcy5zZXR0aW5nc09wZW4gPSB0cnVlO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIC8vc2V0dGluZ3Mgc2hvd2luZy4gY2xvc2UgdGhlIHNldHRpbmdzXG4gICAgdmFyIHNldHRpbmdzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3Nfd3JhcHBlclwiKTtcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKS5yZW1vdmVDaGlsZChzZXR0aW5ncyk7XG4gICAgdGhpcy5zZXR0aW5nc09wZW4gPSBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBhZGQgdGhlIHNldHRpbmdzXG4gKiBAcGFyYW0gZWxlbWVudCAtIHRoZSBlbGVtZW50IHRvIGFwcGVuZCB0b1xuICogQHJldHVybnMgeyp9IC0gdGhlIGVsZW1lbnRcbiAqL1xuQ2hhdEFwcC5wcm90b3R5cGUuYWRkU2V0dGluZ3MgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfY2hhdF9zZXR0aW5nc1wiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcblxuICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0ndXNlcm5hbWUnXVwiKS5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLnVzZXJuYW1lKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J3NlcnZlciddXCIpLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHRoaXMuc2VydmVyKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J2NoYW5uZWwnXVwiKS5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLmNoYW5uZWwpO1xuXG4gIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPSdidXR0b24nXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5zYXZlU2V0dGluZ3MuYmluZCh0aGlzKSk7XG5cbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzXCIpLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNhdmUgdGhlIHNldHRpbmdzIGFuZCByZW9wZW4gY2hhdCB3aXRoIHRoZW1cbiAqL1xuQ2hhdEFwcC5wcm90b3R5cGUuc2F2ZVNldHRpbmdzID0gZnVuY3Rpb24oKVxue1xuICAvL2Nsb3NlIHRoZSBjaGF0LWNvbm5lY3Rpb25cbiAgaWYgKHRoaXMuY2hhdClcbiAge1xuICAgIHRoaXMuY2hhdC5zb2NrZXQuY2xvc2UoKTtcbiAgICB0aGlzLmNoYXQub25saW5lID0gZmFsc2U7XG4gIH1cblxuICB2YXIgZm9ybSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzX2Zvcm1cIik7XG5cbiAgLy9nZXQgdGhlIHZhbHVlcyBmcm9tIHNldHRpbmdzLWZvcm1cbiAgdGhpcy51c2VybmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J3VzZXJuYW1lJ11cIikudmFsdWU7XG4gIHRoaXMuc2VydmVyID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0nc2VydmVyJ11cIikudmFsdWU7XG4gIHRoaXMuY2hhbm5lbCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J2NoYW5uZWwnXVwiKS52YWx1ZTtcblxuICAvL3Nob3cgb2ZmbGluZSB0byB0aGUgdXNlclxuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfaWNvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhdF9vblwiLCBcImNoYXRfY29ubmVjdGluZ1wiLCBcImNoYXRfb2ZmXCIpO1xuICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfaWNvblwiKS5jbGFzc0xpc3QuYWRkKFwiY2hhdF9vZmZcIik7XG5cbiAgdGhpcy5jbGVhckNvbnRlbnRXaW5kb3coKTtcblxuICAvL3N0YXJ0IHRoZSBuZXcgY2hhdFxuICBpZiAodGhpcy51c2VybmFtZSA9PT0gXCJcIilcbiAge1xuICAgIHRoaXMudXNlcm5hbWUgPSBcIlVzZXJcIjtcbiAgfVxuXG4gIC8vc3RhcnQgdGhlIG5ldyBjaGF0XG4gIHRoaXMuY2hhdCA9IG5ldyBDaGF0KHRoaXMuZWxlbWVudCwgdGhpcy5zZXJ2ZXIsIHRoaXMuY2hhbm5lbCwgdGhpcy51c2VybmFtZSk7XG4gIHRoaXMuY2hhdC5zdGFydCgpO1xuICB0aGlzLnNldHRpbmdzT3BlbiA9IGZhbHNlO1xuICB0aGlzLnNldEZvY3VzKCk7XG5cbiAgLy9zYXZlIHRoZSB1c2VybmFtZSB0byBzdG9yYWdlXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgdGhpcy51c2VybmFtZSk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGFkZCBmb2N1cyB0byB0aGUgd2luZG93XG4gKi9cbkNoYXRBcHAucHJvdG90eXBlLmFkZEZvY3VzID0gZnVuY3Rpb24oKVxue1xuICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJmb2N1c2VkX3dpbmRvd1wiKSlcbiAge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNlZF93aW5kb3dcIik7XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gcmVtb3ZlIGZvY3VzIGZyb20gd2luZG93XG4gKi9cbkNoYXRBcHAucHJvdG90eXBlLnJlbW92ZUZvY3VzID0gZnVuY3Rpb24oKVxue1xuICBpZiAodGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImZvY3VzZWRfd2luZG93XCIpKVxuICB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1c2VkX3dpbmRvd1wiKTtcbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBzZXQgZm9jdXNcbiAqL1xuQ2hhdEFwcC5wcm90b3R5cGUuc2V0Rm9jdXMgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNlZF93aW5kb3dcIik7XG4gIHRoaXMuZWxlbWVudC5mb2N1cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0QXBwIDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBDb2xpbiBGcmFwcGVyXG4gKiAyMy8xMC8yMDE2XG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgTGF1bmNoZXJNZW51ID0gcmVxdWlyZShcIi4vTGF1bmNoZXJNZW51XCIpO1xuXG5mdW5jdGlvbiBEZXNrdG9wKClcbntcbiAgdGhpcy5tb3VzZU1vdmUgPSB0aGlzLm1vdXNlTW92ZUZ1bmN0aW9uLmJpbmQodGhpcyk7XG4gIHRoaXMubW91c2VVcCA9IHRoaXMubW91c2VVcEZ1bmN0aW9uLmJpbmQodGhpcyk7XG5cbiAgdGhpcy5hY3RpdmVXaW5kb3cgPSBmYWxzZTsgLy8gdG8gY2hlY2sgd2hpY2ggd2luZG93cyBpcyBmb2N1c2VkXG4gIHRoaXMud2luZG93cyA9IFtdO1xuICB0aGlzLmNsaWNrWCA9IDA7IC8vIHRoZSBwb3NpdGlvbiBvZiB0aGUgbW91c2VcbiAgdGhpcy5jbGlja1kgPSAwOyAvLyB0aGUgcG9zaXRpb24gb2YgdGhlIG1vdXNlXG4gIHRoaXMuekluZGV4ID0gMDsgLy8gZm9yIHRoZSBmb2N1c1xuICB0aGlzLmlkX251bWJlciA9IDEgOyAvLyB0aGUgaWQgb2YgdGhlIHdpbmRvd1xuICB0aGlzLm9mZnNldFggPSAxIDsgLy8gdGhlIFggb2YgdGhlIHdpbmRvdyB3aGVuIHNoZSdzIGNyZWF0ZWRcbiAgdGhpcy5vZmZzZXRZID0gMSA7IC8vIHRoZSBZIG9mIHRoZSB3aW5kb3cgd2hlbiBzaGUncyBjcmVhdGVkXG4gIHRoaXMubGF1bmNoZXIgPSBuZXcgTGF1bmNoZXJNZW51KHRoaXMpO1xuXG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBiYXNpYyBmZWF0dXJlcyBvZiB0aGUgZGVza3RvcFxuICovXG5EZXNrdG9wLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5sYXVuY2hlci5zdGFydCgpO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZURvd24uYmluZCh0aGlzKSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bi5iaW5kKHRoaXMpKTtcbn07XG5cblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSB3aGF0IHdpbGwgaGFwcGVuIGlmIG1vdXNlIHVwXG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLm1vdXNlVXBGdW5jdGlvbiA9IGZ1bmN0aW9uKClcbntcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZU1vdmUpO1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZVVwKTtcbiAgdGhpcy5hY3RpdmVXaW5kb3cuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW92aW5nXCIpO1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSB3aGF0IHdpbGwgaGFwcGVuIHdoZW4gbW91c2UgaXMgZG93blxuICogQHBhcmFtIGV2ZW50XG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLm1vdXNlRG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0OyAvLyBjaGVjayB3aGVyZSB3ZSBjbGlja2VkXG5cbiAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QpICAvLyBpZiB0aGUgcGFyZW50IGNvbnRhaW4gYSBjbGFzc1xuICB7XG4gICAgd2hpbGUgKCFlbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWFpbl9jb250ZW50XCIpKSAvLyBnZXQgdGhlIFwiY29udGVudC1lbGVtZW50XG4gICAge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwid2luZG93XCIpKSAvLyBpbCB3ZSBjbGlja2VkIG9uIGEgd2luZG93XG4gIHtcbiAgICBpZiAocGFyc2VJbnQoZWxlbWVudC5zdHlsZS56SW5kZXgpICE9PSB0aGlzLnpJbmRleCkgLy8gaWYgdGhlIHdpbmRvdyB3ZSBjbGlrZWQgaXMgbm90IHRoZSBvbmUgZm9jdXNlZFxuICAgIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXMoZWxlbWVudCk7IC8vIHNldCBmb2N1cyBvbiB0aGUgd2luZG93XG4gICAgfVxuXG4gICAgLy9hZGQgdGhlIGxpc3RlbmVycyB0byBjaGVjayBmb3IgbW92ZW1lbnQgaWYgY2xpY2sgd2VyZSBpbiB0aGUgd2luZG93X3RvcCBvZiB3aW5kb3dcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIndpbmRvd190b3BcIikpXG4gICAge1xuICAgICAgICB0aGlzLmNsaWNrWCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmFjdGl2ZVdpbmRvdy54OyAvLyBzZXQgdGhlIGNsaWNrXG4gICAgICAgIHRoaXMuY2xpY2tZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuYWN0aXZlV2luZG93Lnk7IC8vIHNldCB0aGUgY2xpY2tcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW92aW5nXCIpOyAvLyBmb3IgY3NzIGNoZWNrIGlmIHdlIG1vdmVkIHRoZSB3aW5kb3dzXG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZU1vdmUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZVVwKTtcbiAgICAgIH1cbiAgfVxuXG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgbW91c2UgbW92ZVxuICogQHBhcmFtIGV2ZW50XG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLm1vdXNlTW92ZUZ1bmN0aW9uID0gZnVuY3Rpb24oZXZlbnQpXG57XG4gIHZhciBuZXdYID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuY2xpY2tYOyAvLyBnZXQgdGhlIG5ldyBwb3N0aW9uIG9uIHRoZSBtb3VzZVxuICB2YXIgbmV3WSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNsaWNrWTsgLy8gZ2V0IHRoZSBuZXcgcG9zdGlvbiBvbiB0aGUgbW91c2VcblxuICAvL2NoZWNrIHdoZXJlIHRoZSBuZXcgbWlkZGxlIHNob3VsZCBiZVxuICB2YXIgbmV3TWlkZGxlWCA9IG5ld1ggKyBwYXJzZUludCh0aGlzLmFjdGl2ZVdpbmRvdy5lbGVtZW50Lm9mZnNldFdpZHRoKSAvIDI7XG4gIHZhciBuZXdNaWRkbGVZID0gbmV3WSArIHBhcnNlSW50KHRoaXMuYWN0aXZlV2luZG93LmVsZW1lbnQub2Zmc2V0SGVpZ2h0KSAvIDI7XG5cbiAgdmFyIHdpbmRvd1cgPSB3aW5kb3cuaW5uZXJXaWR0aDsgLy8gZ2V0IHRoZSB3aWR0aCBvZiB0aGUgd2luZG93XG4gIHZhciB3aW5kb3dIID0gd2luZG93LmlubmVySGVpZ2h0OyAvLyBnZXQgdGhlIGhlaWdodCBvZiB0aGUgd2luZG93XG5cbiAgaWYgKG5ld01pZGRsZVggPCB3aW5kb3dXICYmIG5ld01pZGRsZVggPiAwICYmIG5ld01pZGRsZVkgPCB3aW5kb3dIICYmIG5ld01pZGRsZVkgPiAwKSAgIC8vaWYgdGhlIG1vdmUgaXMgbm90IG91dCBvZiBib3VuZHMgdGhlbiBtb3ZlIGl0XG4gIHtcbiAgICB0aGlzLmFjdGl2ZVdpbmRvdy54ID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuY2xpY2tYO1xuICAgIHRoaXMuYWN0aXZlV2luZG93LnkgPSBldmVudC5jbGllbnRZIC0gdGhpcy5jbGlja1k7XG5cbiAgICB0aGlzLmFjdGl2ZVdpbmRvdy5lbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLmFjdGl2ZVdpbmRvdy54ICsgXCJweFwiOyAvLyBhZGQgdG8gdGhlIGVsZW1lbnQgdGhlIG5ldyBkaW1lbnNpb25cbiAgICB0aGlzLmFjdGl2ZVdpbmRvdy5lbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMuYWN0aXZlV2luZG93LnkgKyBcInB4XCI7IC8vIGFkZCB0byB0aGUgZWxlbWVudCB0aGUgbmV3IGRpbWVuc2lvblxuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSBjbGlja3Mgb24gd2luZG93c1xuICogQHBhcmFtIGV2ZW50XG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLndpbmRvd0J1dHRvbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpXG57XG4gIHZhciBhY3Rpb24gPSBldmVudC50YXJnZXQuY2xhc3NMaXN0O1xuXG4gIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG4gIC8vZ2V0IHRoZSAncGFyZW50JyB3aW5kb3ctZWxlbWVudFxuICBpZiAoZWxlbWVudC5wYXJlbnROb2RlKVxuICB7XG4gICAgd2hpbGUgKCFlbGVtZW50LnBhcmVudE5vZGUuaWQpIC8vIGdldCB0aGUgZWxlbWVudCB3aXRoIGFuIGlkXG4gICAge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53aW5kb3dzLmxlbmd0aDsgaSArPSAxKSAgICAvL2NoZWNrIHdoaWNoIHdpbmRvdyBnb3QgY2xpY2tlZFxuICB7XG4gICAgaWYgKHRoaXMud2luZG93c1tpXS5pZCA9PT0gZWxlbWVudC5pZClcbiAgICB7XG4gICAgICBpbmRleCA9IGk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGluZGV4ICE9PSAtMSkgLy8gaWYgd2UgZm91bmQgdGhhdCBpZFxuICB7XG4gICAgdGhpcy5zZXRGb2N1cyh0aGlzLndpbmRvd3NbaW5kZXhdLmVsZW1lbnQpOyAgICAvL3NldCBmb2N1c1xuXG4gICAgaWYgKGFjdGlvbi5jb250YWlucyhcImV4aXRfYnV0dG9uXCIpKVxuICAgIHtcbiAgICAgIHRoaXMuY2xvc2VXaW5kb3codGhpcy53aW5kb3dzW2luZGV4XS5pZCk7ICAgICAgIC8vY2xvc2UgdGhlIGFwcFxuICAgIH1cbiAgICBlbHNlIGlmIChhY3Rpb24uY29udGFpbnMoXCJtaW5pbWl6ZV9idXR0b25cIikpXG4gICAge1xuICAgICAgdGhpcy53aW5kb3dzW2luZGV4XS5taW5pbWl6ZSgpOyAgICAgICAvL21pbmltaXplIHRoZSBhcHBcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY2xvc2UgYSB3aW5kb3cgYW5kIGRlc3Ryb3kgdGhlIGFwcFxuICogQHBhcmFtIGlkXG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLmNsb3NlV2luZG93ID0gZnVuY3Rpb24oaWQpXG57XG4gIHZhciByZW1vdmVkID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53aW5kb3dzLmxlbmd0aCAmJiAhcmVtb3ZlZDsgaSsrKVxuICB7XG4gICAgaWYgKHRoaXMud2luZG93c1tpXS5pZCA9PT0gaWQpIC8vIGZvdW5kIHRoZSB3aW5kb3cgd2l0aCB0aGUgaWQgaW4gcGFyYW1hdGVyXG4gICAge1xuICAgICAgdmFyIHdpbmRvd3NDbGlja2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIlt2YWx1ZT0naWQ6XCIgKyB0aGlzLndpbmRvd3NbaV0uaWQgKyBcIiddXCIpO1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHdpbmRvd3NDbGlja2VkLnBhcmVudE5vZGU7XG4gICAgICB3aGlsZSAoIWNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b29sX2NvbnRhaW5lclwiKSkgLy8gd2hpbGUgd2UgZG9uJ3QgZ2V0IHRoZSBkaXYgY2xhc3MgPSBjb250YWluZXJcbiAgICAgIHtcbiAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudE5vZGU7XG5cbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHdpbmRvd3NDbGlja2VkLnBhcmVudE5vZGUpOyAvLyByZW1vdmUgdGhlIHdpbmRvd3MgZnJvbSBjb250YWluZXJcblxuICAgICAgdGhpcy5pZF9udW1iZXIgLS07XG4gICAgICB0aGlzLndpbmRvd3NbaV0uZGVzdHJveSgpOyAgICAgICAvLyBkZXN0cm95IHRoZSBhcHBcbiAgICAgIHRoaXMud2luZG93cy5zcGxpY2UoaSwgMSk7ICAgICAgLy8gcmVtb3ZlIGZyb20gd2luZG93LWxpc3RcbiAgICAgIHJlbW92ZWQgPSB0cnVlOyAvLyBzdG9wIHRoZSBmb3JcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gY2xlYXIgYW5kIHJlc2V0IHRoZSBkZXNrdG9wXG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLmNsZWFyRGVza3RvcCA9IGZ1bmN0aW9uKClcbntcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpICs9IDEpXG4gIHtcbiAgICB0aGlzLndpbmRvd3NbaV0uZGVzdHJveSgpOyAvLyBkZXN0cm95IGFsbCB0aGUgd2luZG93c1xuXG4gICAgdmFyIHdpbmRvd3NDbGlja2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIlt2YWx1ZT0naWQ6XCIgKyB0aGlzLndpbmRvd3NbaV0uaWQgKyBcIiddXCIpO1xuICAgIHZhciBjb250YWluZXIgPSB3aW5kb3dzQ2xpY2tlZC5wYXJlbnROb2RlO1xuICAgIHdoaWxlICghY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyhcInRvb2xfY29udGFpbmVyXCIpKSAvLyB3aGlsZSB3ZSBkb24ndCBnZXQgdGhlIGRpdiBjbGFzcyA9IHRvb2xfY29udGFpbmVyXG4gICAge1xuICAgICAgY29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHdpbmRvd3NDbGlja2VkLnBhcmVudE5vZGUpOyAvLyByZW1vdmUgdGhlIHdpbmRvd3MgZnJvbSBjb250YWluZXJcbiAgfVxuXG4gIHRoaXMud2luZG93cyA9IFtdOyAvLyBpbml0YWxpemUgd2luZG93XG4gIHRoaXMuaWRfbnVtYmVyID0gMDtcbiAgdGhpcy5vZmZzZXRYID0gMTtcbiAgdGhpcy5vZmZzZXRZID0gMTtcbiAgdGhpcy56SW5kZXggPSAwO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgaWYga2V5IGlzIHByZXNzZWRcbiAqIEBwYXJhbSBldmVudFxuKi9cbkRlc2t0b3AucHJvdG90eXBlLmtleURvd24gPSBmdW5jdGlvbihldmVudClcbntcbiAgaWYgKHRoaXMuYWN0aXZlV2luZG93LmtleUFjdGl2YXRlZClcbiAge1xuICAgIHRoaXMuYWN0aXZlV2luZG93LmtleUlucHV0KGV2ZW50LmtleUNvZGUpO1xuICB9XG59O1xuXG5cbi8qKlxuICogU2V0IGZvY3VzIHRvIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdG8gc2V0IGZvY3VzIG9uXG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLnNldEZvY3VzID0gZnVuY3Rpb24oZWxlbWVudClcbntcbiAgZWxlbWVudC5mb2N1cygpOyAvLyBmb2N1cyBvbiB0aGUgZWxlbWVudCBjbGlja2VkXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpbmRvd3MubGVuZ3RoOyBpICs9IDEpICAgLy9maW5kIHRoZSB3aW5kb3cgaW4gd2luZG93LWFycmF5XG4gIHtcbiAgICBpZiAodGhpcy53aW5kb3dzW2ldLmlkID09PSBlbGVtZW50LmlkKVxuICAgIHtcbiAgICAgIHRoaXMuYWN0aXZlV2luZG93ID0gdGhpcy53aW5kb3dzW2ldOyAvLyBjaGFuZ2UgdGhlIGFjdGl2ZSB3aW5kb3dcbiAgICAgIHRoaXMuekluZGV4ICs9IDE7IC8vIHpJbmRleCB1c2VkIGZvciBtZXR0cmUgbGEgcGFnZSBkZXZhbnQgbCdhdXJlXG4gICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IHRoaXMuekluZGV4OyAvLyBjaGFuZ2Ugc3R5bGVcbiAgICB9XG4gIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wIDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBDb2xpbiBGcmFwcGVyXG4gKiAyMy8xMC8yMDE2XG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgTWVtb3J5QXBwID0gcmVxdWlyZShcIi4vTWVtb3J5L01lbW9yeUFwcFwiKTtcbnZhciBDaGF0QXBwID0gcmVxdWlyZShcIi4vQ2hhdC9DaGF0QXBwXCIpO1xudmFyIENhbnZhc0FwcCA9IHJlcXVpcmUoXCIuL0NhbnZhcy9DYW52YXNBcHBcIik7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBwYXJhbSBkZXNrdG9wXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBMYXVuY2hlck1lbnUoZGVza3RvcClcbntcbiAgdGhpcy5kZXNrdG9wID0gZGVza3RvcDtcbn1cblxuLyoqXG4gKlxuICovXG5MYXVuY2hlck1lbnUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKVxue1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxhdW5jaGVyX21lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMubGF1bmNoZXJDbGljay5iaW5kKHRoaXMpLCB0cnVlKTsgLy8gYWRkIGxpc3RuZXJcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjbGlja3MgaW4gdGhlIGxhdW5jaGVyXG4gKiBAcGFyYW0gZXZlbnRcbiAqL1xuTGF1bmNoZXJNZW51LnByb3RvdHlwZS5sYXVuY2hlckNsaWNrID0gZnVuY3Rpb24oZXZlbnQpXG57XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGljb247XG4gIHZhciB0aXRsZTtcblxuICB2YXIgZWxlbWVudCA9IHRoaXMuZ2V0Q2xpY2tlZExhdW5jaGVyRWxlbWVudChldmVudC50YXJnZXQpOyAvLyBnZXQgZWxlbWVudCB3ZSBjbGlja2VkXG5cbiAgaWYgKGVsZW1lbnQpIC8vIGlmIHdlIGNsaWtlZCBvbiBhbiBlbGVtZW50XG4gIHtcbiAgICB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7IC8vIGdldCBoaXMgdmFsdWVcbiAgfVxuXG4gIGlmICh2YWx1ZSkgLy8gaWYgaGUgaGFkIGEgdmFsdWVcbiAge1xuICAgIHZhciBzd2l0Y2hUbyA9IHZhbHVlLnNwbGl0KFwiOlwiKTsgLy8gc3BsaXQgYmV0d2VlbiBpZCBhbmQgdGhlIFwicmVhbFwiIHZhbHVlXG5cbiAgICBpZiAoc3dpdGNoVG9bMF0gPT09IFwiaWRcIikgLy8gaWYgd2UgY2xpa2VkIG9uIGEgd2luZG93IFwiYWxyZWFkeSBvcGVuXCJcbiAgICB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b29sdGlwX2Nsb3NlXCIpKVxuICAgICAge1xuICAgICAgICB0aGlzLmRlc2t0b3AuY2xvc2VXaW5kb3coc3dpdGNoVG9bMV0pOyAvLyBjbG9zZSB0aGlzIHdpbmRvd3NcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hUb1dpbmRvdyhzd2l0Y2hUb1sxXSk7IC8vIHN3aXRjaFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIC8vIHN0YXJ0IHRoZSBhcHAgd2hlcmUgd2UgY2xpa2VkXG4gICAge1xuICAgICAgaWNvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlcIikudGV4dENvbnRlbnQ7IC8vIGdldCB0aGUgaWNvblxuICAgICAgdGl0bGUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9vbF90aXRsZVwiKS50ZXh0Q29udGVudDsgLy8gZ2V0IHRoZSB0aXRsZVxuICAgICAgdGhpcy5zdGFydEFwcGxpY2F0aW9uKHZhbHVlLCBpY29uLCB0aXRsZSk7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogRnVuY3Rpb24gdG8gZ2V0IHdoYXQgZWxlbWVudCBnb3QgY2xpY2tlZCBpbiB0aGUgbGF1bmNoZXJcbiAqIEBwYXJhbSB0YXJnZXQgLSB0aGUgZXZlbnQtdGFyZ2V0IGZyb20gY2xpY2tcbiAqIEByZXR1cm5zIERPTS1lbGVtZW50XG4gKi9cbkxhdW5jaGVyTWVudS5wcm90b3R5cGUuZ2V0Q2xpY2tlZExhdW5jaGVyRWxlbWVudCA9IGZ1bmN0aW9uKHRhcmdldClcbntcbiAgdmFyIGVsZW1lbnQ7XG5cbiAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSlcbiAge1xuICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gIH1cbiAgZWxzZSBpZiAodGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpXG4gIHtcbiAgICBlbGVtZW50ID0gdGFyZ2V0LnBhcmVudE5vZGU7IC8vIGlmIGl0J3MgdGhlIGkgdGFnIGluIHRoZSBsaVxuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBzdGFydCBuZXcgYXBwbGljYXRpb25cbiAqL1xuTGF1bmNoZXJNZW51LnByb3RvdHlwZS5zdGFydEFwcGxpY2F0aW9uID0gZnVuY3Rpb24odHlwZSwgaWNvbiwgdGl0bGUpXG57XG4gIHZhciBtYXJnaW5YID0gMTAgKiAodGhpcy5kZXNrdG9wLm9mZnNldFgpOyAvLyBtb3ZlIGEgbGl0dGxlIGJpdCB0aGUgbmV3IHdpbmRvdyBjb21wYXJlZCB0byB0aGUgb2xkIHdpbmRvd1xuICB2YXIgbWFyZ2luWSA9IDEwICogKHRoaXMuZGVza3RvcC5vZmZzZXRZKTsgLy8gbW92ZSBhIGxpdHRsZSBiaXQgdGhlIG5ldyB3aW5kb3cgY29tcGFyZWQgdG8gdGhlIG9sZCB3aW5kb3dcblxuICAvLyBzZXQgdGhlIG9wdGlvblxuICB2YXIgYXBwT3B0aW9ucyA9XG4gIHtcbiAgICBpZDogXCJ3aW5kb3dfbsKwXCIgKyB0aGlzLmRlc2t0b3AuaWRfbnVtYmVyLCAvLyBpZCBvZiB0aGUgd2luZG93XG4gICAgeDogbWFyZ2luWCxcbiAgICB5OiBtYXJnaW5ZLFxuICAgIHpJbmRleDogdGhpcy5kZXNrdG9wLnpJbmRleCxcbiAgICBpY29uOiBpY29uLFxuICAgIHRpdGxlOiB0aXRsZSxcbiAgICBrZXlBY3RpdmF0ZWQ6IGZhbHNlXG4gIH07XG5cbiAgdmFyIG5ld0FwcCA9IHRoaXMuY3JlYXRlQXBwbGljYXRpb24odHlwZSwgYXBwT3B0aW9ucyk7XG5cbiAgaWYgKG5ld0FwcClcbiAge1xuICAgIHZhciBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIG5ld0FwcC5pZCArIFwiIC53aW5kb3dfYnV0dG9uc1wiKTsgICAgIC8vYWRkIGxpc3RlbmVyIHRvIHRoZSB3aW5kb3cgYnV0dG9uc1xuICAgIGJ1dHRvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGVza3RvcC53aW5kb3dCdXR0b25DbGljay5iaW5kKHRoaXMuZGVza3RvcCkpO1xuXG4gICAgdGhpcy5kZXNrdG9wLndpbmRvd3MucHVzaChuZXdBcHApOyAvLyBpbnNlcnQgaW4gdGhlIGFycmF5IHdpbmRvd3NcblxuICAgIHRoaXMuYWRkTWVudUFwcCh0eXBlLCBuZXdBcHApO1xuXG4gICAgdGhpcy5kZXNrdG9wLmlkX251bWJlciArPSAxOyAvLyBpbnNjcmVhc2UgdGhlIGlkXG4gICAgdGhpcy5kZXNrdG9wLm9mZnNldFggKz0gMTsgLy8gaW5zY3JlYXNlIHRoZSBvZmZzZXRYXG4gICAgdGhpcy5kZXNrdG9wLm9mZnNldFkgKz0gMTsgLy8gaW5zY3JlYXNlIHRoZSBvZmZzZXRZXG5cbiAgICAvL3NldCBmb2N1cyB0byB0aGUgbmV3IGFwcCBhbmQgY2hlY2sgYm91bmRzXG4gICAgdGhpcy5kZXNrdG9wLnNldEZvY3VzKG5ld0FwcC5lbGVtZW50KTtcbiAgICB0aGlzLmNoZWNrQm91bmRzKG5ld0FwcCk7XG4gIH1cbn07XG5cbkxhdW5jaGVyTWVudS5wcm90b3R5cGUuY3JlYXRlQXBwbGljYXRpb24gPSBmdW5jdGlvbih0eXBlLCBhcHBPcHRpb25zKSB7XG4gIHZhciBuZXdBcHA7XG5cbiAgLy9jaGVjayB3aGF0IGFwcCB0byBzdGFydCBhbmQgc3RhcnQgaXQsIGFkZCBldmVudHVhbGx5IGFuZCBrZXlBY3RpdmF0ZWRcbiAgc3dpdGNoICh0eXBlKVxuICB7XG4gICAgY2FzZSBcIlJlc2V0XCI6XG4gICAge1xuICAgICAgdGhpcy5kZXNrdG9wLmNsZWFyRGVza3RvcCgpOyAgLy9yZXNldCB0aGUgZGVza3RvcFxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJNZW1vcnlcIjpcbiAgICB7XG4gICAgICBhcHBPcHRpb25zLmtleUFjdGl2YXRlZCA9IHRydWU7IC8vIHRvIHBsYXkgd2l0aCB0aGUga2V5Ym9hcmRcbiAgICAgIG5ld0FwcCA9IG5ldyBNZW1vcnlBcHAoYXBwT3B0aW9ucyk7XG4gICAgICBuZXdBcHAuc3RhcnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNhc2UgXCJDaGF0XCI6XG4gICAge1xuICAgICAgbmV3QXBwID0gbmV3IENoYXRBcHAoYXBwT3B0aW9ucyk7XG4gICAgICBuZXdBcHAuc3RhcnQoKTtcblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY2FzZSBcIkNhbnZhc1wiIDpcbiAgICB7XG4gICAgICBuZXdBcHAgPSBuZXcgQ2FudmFzQXBwKGFwcE9wdGlvbnMpO1xuICAgICAgbmV3QXBwLnN0YXJ0KCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdBcHA7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSBpZiB0aGUgbmV3IHdpbmRvdyBpcyBvdXQgb2YgYm91bmRzXG4gKiBAcGFyYW0gYXBwIC0gdGhlIGFwcC1vYmplY3QgdG8gYmUgY2hlY2tlZFxuICovXG5MYXVuY2hlck1lbnUucHJvdG90eXBlLmNoZWNrQm91bmRzID0gZnVuY3Rpb24oYXBwKVxue1xuICB2YXIgd2luZG93VyA9IHdpbmRvdy5pbm5lcldpZHRoOyAvLyBnZXQgdGhlIGRpbWVuc2lvbiBvZiB0aGUgd2luZG93XG4gIHZhciB3aW5kb3dIID0gd2luZG93LmlubmVySGVpZ2h0OyAvLyBnZXQgdGhlIGRpbWVuc2lvbiBvZiB0aGUgd2luZG93XG5cbiAgdmFyIGFwcFJpZ2h0ID0gYXBwLnggKyBwYXJzZUludChhcHAuZWxlbWVudC5vZmZzZXRXaWR0aCk7XG4gIHZhciBhcHBCb3QgPSBhcHAueSArIHBhcnNlSW50KGFwcC5lbGVtZW50Lm9mZnNldEhlaWdodCk7XG5cbiAgaWYgKGFwcFJpZ2h0ID4gd2luZG93VyB8fCBhcHAueCA8IDApIC8vIGlmIHRoZSBib3VuZHMgYXJlIGNyb3NzIGF0IHRoZSByaWdodCBvZiB0aGUgd2luZG93XG4gIHtcbiAgICB0aGlzLmRlc2t0b3Aub2Zmc2V0WCA9IDE7IC8vIHJlc2V0IHRoZSBvZmZzZXRYXG5cbiAgICBhcHAueCA9IDEwICogKHRoaXMuZGVza3RvcC5vZmZzZXRYKTsgLy8gc2V0IG5ldyBwYXJhbVxuICAgIGFwcC5lbGVtZW50LnN0eWxlLmxlZnQgPSBhcHAueCArIFwicHhcIjsgLy8gc2V0IHRoZSBkaW1lbnNpb25cbiAgfVxuICBlbHNlIGlmIChhcHBCb3QgPiB3aW5kb3dIIHx8IGFwcC55IDwgMCkgLy8gaWYgdGhlIGJvdW5kcyBhcmUgY3Jvc3MgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XG4gIHtcbiAgICB0aGlzLmRlc2t0b3Aub2Zmc2V0WSA9IDE7ICAgIC8vcmVzZXQgdGhlIG9mZnNldFlcblxuICAgIGFwcC55ID0gMTAgKiAodGhpcy5kZXNrdG9wLm9mZnNldFkpOyAvLyBzZXQgbmV3IHBhcmFtXG4gICAgYXBwLmVsZW1lbnQuc3R5bGUudG9wID0gYXBwLnkgKyBcInB4XCI7IC8vIHNldCB0aGUgZGltZW5zaW9uXG4gIH1cbn07XG5cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgZm9jdXMgb24gY2FsbCwgYW5kIHNob3cgbWluaW1pemVkIHdpbmRvdyBhZ2FpblxuICogQHBhcmFtIGlkIC0gdGhlIHdpbmRvdy1pZCB0byBzZXQgZm9jdXMgb25cbiAqL1xuTGF1bmNoZXJNZW51LnByb3RvdHlwZS5zd2l0Y2hUb1dpbmRvdyA9IGZ1bmN0aW9uKGlkKVxue1xuICB2YXIgd2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIGlkKTtcbiAgaWYgKHdpbmRvdylcbiAge1xuICAgIGlmICh3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWluaW1pemVkXCIpKSAvLyBpZiB0aGUgd2luZG93cyB3YXMgbWluaW1pemVkXG4gICAge1xuICAgICAgd2luZG93LmNsYXNzTGlzdC5yZW1vdmUoXCJtaW5pbWl6ZWRcIik7XG4gICAgfVxuICAgIHRoaXMuZGVza3RvcC5zZXRGb2N1cyh3aW5kb3cpOyAvLyBzZXQgZm9jdXNcbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBhZGQgYSBuZXcgYXBwXG4gKi9cbkxhdW5jaGVyTWVudS5wcm90b3R5cGUuYWRkTWVudUFwcCA9IGZ1bmN0aW9uKHR5cGUsIGFwcClcbntcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsaVt2YWx1ZT0nXCIgKyB0eXBlICsgXCInXSAudG9vbF9jb250YWluZXJcIik7XG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVtcGxhdGVfdG9vbHRpcFwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi50b29sdGlwXCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcC50aXRsZSArIFwiKFwiICsgYXBwLmlkICsgXCIpXCIpKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi50b29sdGlwXCIpLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIFwiaWQ6XCIgKyBhcHAuaWQpO1xuICB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKFwiLnRvb2x0aXBfY2xvc2VcIikuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgXCJpZDpcIiArIGFwcC5pZCk7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExhdW5jaGVyTWVudSA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgV2luZG93ID0gcmVxdWlyZSAoXCIuLi9XaW5kb3dcIik7XG52YXIgR2FtZSA9IHJlcXVpcmUoXCIuL01lbW9yeUdhbWVcIik7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWVtb3J5QXBwKG9wdGlvbnMpXG57XG4gIFdpbmRvdy5jYWxsKHRoaXMsb3B0aW9ucyk7XG5cbiAgdGhpcy5zZXR0aW5nc09wZW4gPSBmYWxzZTsgLy8gdG8gZGlzcGxheSBvciBub3QgdGhlIHNldHRpbmdzXG4gIHRoaXMuZ2FtZSA9IHVuZGVmaW5lZDsgLy8gdGhlIG1lbW9yeSBnYW1lc1xuICB0aGlzLmJvYXJkU2l6ZSA9IFs0LCA0XTsgLy8gcnVsZXNcbiAgdGhpcy5tYXJrZWRDYXJkID0gdW5kZWZpbmVkOyAvLyBmb3IgdGhlIGtleWJvYXJkXG59XG5cbk1lbW9yeUFwcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFdpbmRvdy5wcm90b3R5cGUpOyAvLyBpbmhlcml0YW5jZVxuTWVtb3J5QXBwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9ICBNZW1vcnlBcHA7XG5cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbml0IHRoZSBiYXNpY3NcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5kaXNwbGF5KCk7XG5cbiAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X21lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMubWVudUNsaWNrZWQuYmluZCh0aGlzKSk7XG5cbiAgLy9jcmVhdGUgbmV3IGdhbWUgYW5kIGluaXQgaXRcbiAgdGhpcy5nYW1lID0gbmV3IEdhbWUoNCwgNCx0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfY29udGVudFwiKSk7XG4gIHRoaXMuZ2FtZS5zdGFydCgpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSBhcHBsaWNhdGlvblxuICovXG5NZW1vcnlBcHAucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbigpXG57XG4gIFdpbmRvdy5wcm90b3R5cGUuZGlzcGxheS5jYWxsKHRoaXMpO1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1lbW9yeV9hcHBcIik7XG5cbiAgdmFyIG1lbnUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kb3dfbWVudVwiKTtcbiAgdmFyIGFsdDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX21lbnVcIikuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gIGFsdDEucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTmV3IEdhbWVcIikpO1xuXG4gIHZhciBhbHQyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV9tZW51XCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICBhbHQyLnF1ZXJ5U2VsZWN0b3IoXCIubWVudVwiKS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlNldHRpbmdzXCIpKTtcblxuICBtZW51LmFwcGVuZENoaWxkKGFsdDEpO1xuICBtZW51LmFwcGVuZENoaWxkKGFsdDIpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgdGhlIG1lbnUtY2xpY2tlZFxuICogQHBhcmFtIGV2ZW50IC0gY2xpY2stZXZlbnRcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5tZW51Q2xpY2tlZCA9IGZ1bmN0aW9uKGV2ZW50KVxue1xuICB2YXIgdGFyZ2V0O1xuICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIpICAvLyBpZiB3ZSBjbGlja2VkIG9uIHRoZSBvbmUgb2YgdGhlIGEgdGFnIG1lbnVcbiAge1xuICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCA7XG4gIH1cblxuXG4gIGlmICh0YXJnZXQpIC8vY2hlY2sgd2hhdCB3YXMgY2xpY2tlZFxuICB7XG4gICAgc3dpdGNoICh0YXJnZXQpXG4gICAge1xuICAgICAgY2FzZSBcIlNldHRpbmdzXCI6XG4gICAgICB7XG4gICAgICAgIHRoaXMubWVudVNldHRpbmdzKCk7IC8vIGRpc3BsYXkgc2V0dGluZ3NcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJOZXcgR2FtZVwiOlxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5nc09wZW4pXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzT3BlbiA9IGZhbHNlOyAgLy9oaWRlIHRoZSBzZXR0aW5nc1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdGFydCgpOyAvLyByZXN0YXJ0XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byByZXN0YXJ0IHRoZSBnYW1lXG4gKiBAcGFyYW0gdmFsdWUgLSB0aGUgYm9hcmQtc2l6ZSAoZWcuIDR4NClcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5yZXN0YXJ0ID0gZnVuY3Rpb24odmFsdWUpXG57XG4gIGlmICh2YWx1ZSlcbiAge1xuICAgIHRoaXMuYm9hcmRTaXplID0gdmFsdWUuc3BsaXQoXCJ4XCIpO1xuICB9XG5cbiAgdmFyIHkgPSB0aGlzLmJvYXJkU2l6ZVsxXTsgLy8gZmluIGRpbWVuc2lvblxuICB2YXIgeCA9IHRoaXMuYm9hcmRTaXplWzBdOyAvLyBmaW4gZGltZW5zaW9uXG5cbiAgLy9jbGVhciB0aGUgY29udGVudFxuICB0aGlzLmNsZWFyQ29udGVudFdpbmRvdygpO1xuXG4gIC8vcmVtb3ZlIG9sZCBldmVudGhhbmRsZXJzXG4gIHRoaXMuZ2FtZS5yZW1vdmVFdmVudHMoKTtcblxuICAvL2NyZWF0ZSBuZXcgZ2FtZSBhbmQgaW5pdCBpdFxuICB0aGlzLmdhbWUgPSBuZXcgR2FtZSh4LCB5LHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19jb250ZW50XCIpKTtcbiAgdGhpcy5nYW1lLnN0YXJ0KCk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNob3cvaGlkZSB0aGUgc2V0dGluZ3NcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5tZW51U2V0dGluZ3MgPSBmdW5jdGlvbigpXG57XG4gIGlmICghdGhpcy5zZXR0aW5nc09wZW4pXG4gIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX3NldHRpbmdzXCIpLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgIHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3NcIikuY2xhc3NMaXN0LmFkZChcIm1lbW9yeV9zZXR0aW5nc1wiKTtcblxuICAgIHRlbXBsYXRlID0gdGhpcy5hZGRTZXR0aW5ncyh0ZW1wbGF0ZSk7XG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIHRoaXMuc2V0dGluZ3NPcGVuID0gdHJ1ZTtcbiAgfVxuICBlbHNlXG4gICAge1xuICAgIC8vaGlkZSB0aGUgc2V0dGluZ3NcbiAgICB2YXIgc2V0dGluZ3MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR0aW5nc193cmFwcGVyXCIpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19jb250ZW50XCIpLnJlbW92ZUNoaWxkKHNldHRpbmdzKTtcbiAgICB0aGlzLnNldHRpbmdzT3BlbiA9IGZhbHNlO1xuICB9XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGFkZCB0aGUgc2V0dGluZ3NcbiAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdG8gcHJpbnQgdG9cbiAqIEByZXR1cm5zIHsqfSAtIHRoZSBlbGVtZW50XG4gKi9cbk1lbW9yeUFwcC5wcm90b3R5cGUuYWRkU2V0dGluZ3MgPSBmdW5jdGlvbihlbGVtZW50KVxue1xuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX21lbW9yeV9zZXR0aW5nc1wiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcblxuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3NcIikuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPSdidXR0b24nXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5zYXZlU2V0dGluZ3MuYmluZCh0aGlzKSk7XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHNhdmUgdGhlIHNldHRpbmdzIGFuZCBydW4gbmV3IGdhbWVcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5zYXZlU2V0dGluZ3MgPSBmdW5jdGlvbigpXG57XG4gIHZhciB2YWx1ZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwic2VsZWN0W25hbWU9J2JvYXJkLXNpemUnXVwiKS52YWx1ZTtcblxuICAvL3Jlc3RhcnQgd2l0aCB0aGUgbmV3IHNldHRpbmdzXG4gIHRoaXMucmVzdGFydCh2YWx1ZSk7XG4gIHRoaXMuc2V0dGluZ3NPcGVuID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUga2V5IGlucHV0XG4gKiBAcGFyYW0ga2V5IC0ga2V5Y29kZSB0byBoYW5kbGVcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5rZXlJbnB1dCA9IGZ1bmN0aW9uKGtleSlcbntcbiAgaWYgKCF0aGlzLm1hcmtlZENhcmQpICAvLyBpZiB0aGVyZSBpcyBubyBjYXJkIG1hcmtlZFxuICB7XG4gICAgdGhpcy5tYXJrZWRDYXJkID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FyZFwiKTtcbiAgICB0aGlzLm1hcmtlZENhcmQuY2xhc3NMaXN0LmFkZChcIm1hcmtlZFwiKTsgLy8gc28gd2UgY2FuIGRvIHNvbWV0aGluZyB3aXRoIGNzc1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRoaXMubWFya2VkQ2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwibWFya2VkXCIpO1xuICAgIHN3aXRjaCAoa2V5KVxuICAgIHtcbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0IGtleVxuICAgICAge1xuICAgICAgICB0aGlzLmtleVJpZ2h0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzNzogLy8gbGVmdCBrZXlcbiAgICAgIHtcbiAgICAgICAgdGhpcy5rZXlMZWZ0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzODogLy8gdXAga2V5XG4gICAgICB7XG4gICAgICAgIHRoaXMua2V5VXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgNDA6IC8vIGRvd24ga2V5XG4gICAgICB7XG4gICAgICAgIHRoaXMua2V5RG93bigpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgIHtcbiAgICAgICAgdGhpcy5nYW1lLnR1cm5DYXJkKHRoaXMubWFya2VkQ2FyZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1hcmtlZENhcmQuY2xhc3NMaXN0LnRvZ2dsZShcIm1hcmtlZFwiKTtcbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgaWYga2V5IHJpZ2h0IHByZXNzZWRcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5rZXlSaWdodCA9IGZ1bmN0aW9uKClcbntcbiAgaWYgKHRoaXMubWFya2VkQ2FyZC5uZXh0RWxlbWVudFNpYmxpbmcpICAvLyBpZiB0aGVyZSBpcyBhIHJpZ2h0IHNpYmxpbmdcbiAge1xuICAgIHRoaXMubWFya2VkQ2FyZCA9IHRoaXMubWFya2VkQ2FyZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgaWYgKHRoaXMubWFya2VkQ2FyZC5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZykgLy8gaWYgdGhlIG1hcmtlZCBjYXJkIGlzIHRoZSBsYXN0IG9uZSBvbiB0aGUgcmlnaHRcbiAgICB7XG4gICAgICB0aGlzLm1hcmtlZENhcmQgPSB0aGlzLm1hcmtlZENhcmQucGFyZW50Tm9kZS5uZXh0RWxlbWVudFNpYmxpbmcuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICB0aGlzLm1hcmtlZENhcmQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkXCIpOyAvLyBzdGFydCBmcm9tIHRvcFxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgaWYga2V5IGxlZnQgcHJlc3NlZFxuICovXG5NZW1vcnlBcHAucHJvdG90eXBlLmtleUxlZnQgPSBmdW5jdGlvbigpXG57XG4gIC8vZmluZCBwcmV2aW91cyBjYXJkXG4gIGlmICh0aGlzLm1hcmtlZENhcmQucHJldmlvdXNFbGVtZW50U2libGluZykgLy9pZiB0aGVyZSBpcyBhIGxlZnQgc2libGluZ1xuICB7XG4gICAgdGhpcy5tYXJrZWRDYXJkID0gdGhpcy5tYXJrZWRDYXJkLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgaWYgKHRoaXMubWFya2VkQ2FyZC5wYXJlbnROb2RlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIC8vIGlmIHRoZSBtYXJrZWQgY2FyZCBpcyB0aGUgbGFzdCBvbmUgb24gdGhlIGxlZnRcbiAgICB7XG4gICAgICB0aGlzLm1hcmtlZENhcmQgPSB0aGlzLm1hcmtlZENhcmQucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuICAgIGVsc2UgLy8gc3RhcnQgZnJvbSBib3R0b20gcmlnaHRcbiAgICB7XG4gICAgICB2YXIgcm93cyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJvd1wiKTtcbiAgICAgIHZhciBsYXN0Um93ID0gcm93c1tyb3dzLmxlbmd0aCAtIDFdO1xuICAgICAgdGhpcy5tYXJrZWRDYXJkID0gbGFzdFJvdy5sYXN0RWxlbWVudENoaWxkO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgaWYga2V5IHVwIHByZXNzZWRcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5rZXlVcCA9IGZ1bmN0aW9uKClcbntcbiAgLy9maW5kIG5leHQgcm93IGFuZCBjYXJkXG4gIHZhciByb3c7XG4gIHZhciByb3dZO1xuXG4gIGlmICh0aGlzLm1hcmtlZENhcmQucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKVxuICB7XG4gICAgdmFyIGlkID0gdGhpcy5tYXJrZWRDYXJkLmNsYXNzTGlzdFswXS5zbGljZSgtMik7IC8vIHNsaWNlKC0yKSBleHRyYWN0cyB0aGUgbGFzdCB0d28gZWxlbWVudHMgaW4gdGhlIHNlcXVlbmNlLlxuICAgIHJvd1kgPSBwYXJzZUludChpZC5jaGFyQXQoMCkpIC0gMTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICAvL2JlZ2luIGZyb20gYm90dG9tXG4gICAgdmFyIHJvd3MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5yb3dcIik7XG4gICAgcm93ID0gcm93c1tyb3dzLmxlbmd0aCAtIDFdO1xuICAgIHJvd1kgPSByb3dzLmxlbmd0aCAtIDE7XG4gIH1cblxuICAvL2ZpbmQgd2hhdCB4LXBvc2l0aW9uIGluIHRoZSByb3cgdGhlIG1hcmtlZCBjYXJkIGlzIG9uXG4gIHZhciBjYXJkWCA9IHRoaXMubWFya2VkQ2FyZC5jbGFzc0xpc3RbMF0uc2xpY2UoLTEpO1xuICB0aGlzLm1hcmtlZENhcmQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgcm93WSArIGNhcmRYKTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaGFuZGxlIGlmIGtleSBkb3duIHByZXNzZWRcbiAqL1xuTWVtb3J5QXBwLnByb3RvdHlwZS5rZXlEb3duID0gZnVuY3Rpb24oKVxue1xuICAvL2ZpbmQgbmV4dCByb3cgYW5kIGNhcmRcbiAgdmFyIHJvd1k7XG5cbiAgaWYgKHRoaXMubWFya2VkQ2FyZC5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZylcbiAge1xuICAgIHZhciBpZCA9IHRoaXMubWFya2VkQ2FyZC5jbGFzc0xpc3RbMF0uc2xpY2UoLTIpO1xuICAgIHJvd1kgPSBwYXJzZUludChpZC5jaGFyQXQoMCkpICsgMTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICByb3dZID0gMDtcbiAgfVxuXG4gIC8vZmluZCB3aGF0IHgtcG9zaXRpb24gaW4gdGhlIHJvdyB0aGUgbWFya2VkIGNhcmQgaXMgb25cbiAgdmFyIGNhcmRYID0gdGhpcy5tYXJrZWRDYXJkLmNsYXNzTGlzdFswXS5zbGljZSgtMSk7IC8vIGxhc3QgZWxlbWVudFxuICB0aGlzLm1hcmtlZENhcmQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgcm93WSArIGNhcmRYKTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUFwcCA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAcGFyYW0gaWRcbiAqIEBwYXJhbSBpbWdfbnVtYmVyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWVtb3J5Q2FyZChpZCwgaW1nX251bWJlcilcbntcbiAgdGhpcy5pZCA9IGlkO1xuICB0aGlzLmltZ19udW1iZXIgPSBpbWdfbnVtYmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUNhcmQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICogQHBhcmFtIHhcbiAqIEBwYXJhbSB5XG4gKiBAcGFyYW0gZWxlbWVudFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1lbW9yeUNvbnRlbnQoeCwgeSwgZWxlbWVudClcbntcbiAgdGhpcy54ID0geDtcbiAgdGhpcy55ID0geTtcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICB0aGlzLmRpc3BsYXlDYXJkcygpO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHByaW50IHRoZSBjYXJkc1xuICovXG5NZW1vcnlDb250ZW50LnByb3RvdHlwZS5kaXNwbGF5Q2FyZHMgPSBmdW5jdGlvbigpXG57XG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIHZhciByb3dEaXY7XG4gIHZhciBjYXJkRGl2O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy55OyBpICs9IDEpXG4gIHtcbiAgICByb3dEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvd0Rpdi5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLng7IGogKz0gMSkgLy8gY3JlYXRlIGEgZGl2IGZvciBlYWNoIGNhcmRcbiAgICB7XG4gICAgICBjYXJkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNhcmREaXYuY2xhc3NMaXN0LmFkZChcImNhcmQtXCIgKyBpICsgaiwgXCJjYXJkXCIpO1xuICAgICAgcm93RGl2LmFwcGVuZENoaWxkKGNhcmREaXYpO1xuICAgIH1cbiAgICBmcmFnLmFwcGVuZENoaWxkKHJvd0Rpdik7XG4gIH1cblxuICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeUNvbnRlbnQgO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IENvbGluIEZyYXBwZXJcbiAqIDIzLzEwLzIwMTZcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIE1lbW9yeUNvbnRlbnQgPSByZXF1aXJlKFwiLi9NZW1vcnlDb250ZW50XCIpO1xudmFyIE1lbW9yeUNhcmQgPSByZXF1aXJlKFwiLi9NZW1vcnlDYXJkXCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAcGFyYW0geFxuICogQHBhcmFtIHlcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWVtb3J5R2FtZSh4LCB5LCBlbGVtZW50KVxue1xuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLmxheW91dCA9IG5ldyBNZW1vcnlDb250ZW50KHRoaXMueCwgdGhpcy55LCBlbGVtZW50KTtcbiAgdGhpcy5ib2FyZCA9IFtdOyAvLyBhcnJheSBmb3IgdGhlIGdhbWVcbiAgdGhpcy52aXNpYmxlQ2FyZHMgPSBbXTsgLy8gYXJyYXkgdG8gZ2V0IHRoZSB2aXNpYmxlIGNhcmRcbiAgdGhpcy50dXJucyA9IDA7IC8vIHRoZSBudW1iZXIgb2YgdGhlIHR1cm5cbiAgdGhpcy5jb3JyZWN0Q291bnQgPSAwO1xuICB0aGlzLmltYWdlTGlzdCA9IFswLCAwLCAxLCAxLCAyLCAyLCAzLCAzLCA0LCA0LCA1LCA1LCA2LCA2LCA3LCA3XTtcbiAgdGhpcy5pbWFnZXMgPSB0aGlzLmltYWdlTGlzdC5zbGljZSgwLCAodGhpcy55ICogdGhpcy54KSk7XG4gIHRoaXMuY2xpY2tGdW5jID0gdGhpcy5jbGljay5iaW5kKHRoaXMpO1xuXG4gIC8vc2h1ZmZsZSBhbmQgYWRkIGV2ZW50bGlzdGVuZXJzXG4gIHRoaXMuc2h1ZmZsZSgpO1xuICB0aGlzLmFkZEV2ZW50cygpO1xufVxuXG4vKipcbiAqIEluaXQgdGhlIGdhbWVcbiAqL1xuTWVtb3J5R2FtZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpXG57XG4gIHZhciBpID0gMDtcblxuXG4gIHRoaXMuYm9hcmQgPSBbXTsgLy9pbml0IHRoZSBlbXB0eSBib2FyZC1hcnJheVxuICBpZiAodGhpcy54ID4gdGhpcy55KVxuICB7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMueDsgaSArPSAxKSAvLyBjcmVhdGUgdGhlIGRpbWVuc2lvbiBvZiBhcnJheVxuICAgIHtcbiAgICAgIHRoaXMuYm9hcmQucHVzaChuZXcgQXJyYXkodGhpcy55KSk7XG4gICAgfVxuICB9XG4gIGVsc2VcbiAge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnk7IGkgKz0gMSkgLy8gY3JlYXRlIHRoZSBkaW1lbnNpb24gb2YgYXJyYXlcbiAgICB7XG4gICAgICB0aGlzLmJvYXJkLnB1c2gobmV3IEFycmF5KHRoaXMueCkpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMudmlzaWJsZUNhcmRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMueTsgaSArPSAxKSAgIC8vcHVzaCBuZXcgY2FyZHMgdG8gdGhlIGJvYXJkLWFycmF5XG4gIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMueCAtIDE7IGogKz0gMilcbiAgICB7XG4gICAgICB0aGlzLmJvYXJkW2ldW2pdID0gbmV3IE1lbW9yeUNhcmQoXCJcIiArIGkgKyBqLCB0aGlzLmltYWdlcy5wb3AoKSk7IC8vIGNyZWF0ZSB0aGUgY2FyZHNcbiAgICAgIHRoaXMuYm9hcmRbaV1baiArIDFdID0gbmV3IE1lbW9yeUNhcmQoXCJcIiArIGkgKyAoaiArIDEpLCB0aGlzLmltYWdlcy5wb3AoKSk7IC8vIGNyZWF0ZSB0aGUgY2FyZHNcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gc2h1ZmZsZSB0aGUgaW1hZ2VzLWFycmF5XG4gKi9cbk1lbW9yeUdhbWUucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbigpXG57XG4gIHZhciB0ZW1wO1xuICB2YXIgcmFuZDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmltYWdlcy5sZW5ndGg7IGkgKz0gMSlcbiAge1xuICAgIHRlbXAgPSB0aGlzLmltYWdlc1tpXTtcbiAgICByYW5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5pbWFnZXMubGVuZ3RoKTtcbiAgICB0aGlzLmltYWdlc1tpXSA9IHRoaXMuaW1hZ2VzW3JhbmRdO1xuICAgIHRoaXMuaW1hZ2VzW3JhbmRdID0gdGVtcDtcbiAgfVxufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGFkZCB0aGUgZXZlbnRzIG5lZWRlZFxuICovXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0Z1bmMpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byByZW1vdmUgdGhlIGV2ZW50c1xuICovXG5NZW1vcnlHYW1lLnByb3RvdHlwZS5yZW1vdmVFdmVudHMgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0Z1bmMpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNsaWNrc1xuICogQHBhcmFtIGV2ZW50IC0gdGhlIGNsaWNrLWV2ZW50XG4gKi9cbk1lbW9yeUdhbWUucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24oZXZlbnQpXG57XG4gIHRoaXMudHVybkNhcmQoZXZlbnQudGFyZ2V0KTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gdHVybiB0aGUgZ2l2ZW4gY2FyZGVcbiAqIEBwYXJhbSBlbGVtZW50IC0gdGhlIGNhcmQgdG8gdHVyblxuICovXG5NZW1vcnlHYW1lLnByb3RvdHlwZS50dXJuQ2FyZCA9IGZ1bmN0aW9uKGVsZW1lbnQpXG57XG4gIGlmICh0aGlzLnZpc2libGVDYXJkcy5sZW5ndGggPCAyICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVcIikpIC8vIGlmIHdlIGRpZG4ndCB0dXJuZWQgMiBjYXJkcyBhbmQgdGhlIGNhcmQgbm90IGFscmVhZHkgdHVybmVkXG4gIHtcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkXCIpKVxuICAgIHtcbiAgICAgIHZhciB5eCA9IGVsZW1lbnQuY2xhc3NMaXN0WzBdLnNwbGl0KFwiLVwiKVsxXTtcbiAgICAgIHZhciB5ID0geXguY2hhckF0KDApO1xuICAgICAgdmFyIHggPSB5eC5jaGFyQXQoMSk7XG5cblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaW1nLVwiICsgdGhpcy5ib2FyZFt5XVt4XS5pbWdfbnVtYmVyKTsgLy9hZGQgY2xhc3NlcyB0byBzaG93IHRoZSBjYXJkXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbWdcIik7XG5cbiAgICAgIHRoaXMudmlzaWJsZUNhcmRzLnB1c2godGhpcy5ib2FyZFt5XVt4XSk7XG5cbiAgICAgIC8vZGlzYWJsZSB0aGUgY2FyZCB0aGF0IGdvdCBjbGlja2VkXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgdGhpcy5ib2FyZFt5XVt4XS5pZCkuY2xhc3NMaXN0LmFkZChcImRpc2FibGVcIik7XG5cbiAgICAgIGlmICh0aGlzLnZpc2libGVDYXJkcy5sZW5ndGggPT09IDIpXG4gICAgICB7XG4gICAgICAgIHRoaXMuY2hlY2tDb3JyZWN0KCk7IC8vIGNoZWNrIGlmIGl0J3MgdGhlIHNhbWUgY2FyZHNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuKiBGdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgcGFpciBpcyB0aGUgc2FtZVxuKi9cbk1lbW9yeUdhbWUucHJvdG90eXBlLmNoZWNrQ29ycmVjdCA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy50dXJucyArPSAxO1xuICBpZiAodGhpcy52aXNpYmxlQ2FyZHNbMF0uaW1nX251bWJlciA9PT0gdGhpcy52aXNpYmxlQ2FyZHNbMV0uaW1nX251bWJlcilcbiAge1xuICAgIC8vaXQgd2FzIHRoZSBzYW1lIGltYWdlLCBzaG93IGl0IHRvIHRoZSB1c2VyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FyZC1cIiArIHRoaXMudmlzaWJsZUNhcmRzWzBdLmlkKS5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTsgLy8gcmlnaHRcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgdGhpcy52aXNpYmxlQ2FyZHNbMV0uaWQpLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpOyAvLyByaWdodFxuXG4gICAgLy9yZXNldCB0aGUgdmlzaWJsZS1jYXJkcyBhcnJheVxuICAgIHRoaXMudmlzaWJsZUNhcmRzID0gW107XG5cbiAgICB0aGlzLmNvcnJlY3RDb3VudCArPSAxO1xuXG4gICAgaWYgKHRoaXMuY29ycmVjdENvdW50ID09PSAodGhpcy54ICogdGhpcy55IC8gMikpXG4gICAge1xuICAgICAgLy90aGUgZ2FtZSBpcyBvdmVyIHNpbmNlIHRoZSBjb3JyZWN0Y291bnQgaXMgdGhlIGFtb3VudCBvZiBjYXJkc1xuICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgIH1cbiAgfVxuICBlbHNlXG4gIHtcbiAgICAvL2l0IHdhcyBub3QgY29ycmVjdCwgc2V0IHRoZSBjbGFzc2VzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZpc2libGVDYXJkcy5sZW5ndGg7IGkgKz0gMSlcbiAgICB7XG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgdGhpcy52aXNpYmxlQ2FyZHNbaV0uaWQpLmNsYXNzTGlzdC5hZGQoXCJ3cm9uZ1wiKTtcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhcmQtXCIgKyB0aGlzLnZpc2libGVDYXJkc1tpXS5pZCkuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVcIik7XG4gICAgfVxuXG4gICAgLy90dXJuIGJhY2sgdGhlIGNhcmRzXG4gICAgc2V0VGltZW91dCh0aGlzLnR1cm5CYWNrQ2FyZHMuYmluZCh0aGlzKSwgMTAwMCk7XG4gIH1cbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gdHVybiBiYWNrIGNhcmRzIHdoZW4gd3JvbmdcbiAqL1xuTWVtb3J5R2FtZS5wcm90b3R5cGUudHVybkJhY2tDYXJkcyA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIHRlbXBDYXJkO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmlzaWJsZUNhcmRzLmxlbmd0aDsgaSArPSAxKVxuICB7XG4gICAgdGVtcENhcmQgPSB0aGlzLnZpc2libGVDYXJkc1tpXTtcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLVwiICsgdGVtcENhcmQuaWQpLmNsYXNzTGlzdC5yZW1vdmUoXCJ3cm9uZ1wiLCBcImltZ1wiLCBcImltZy1cIiArIHRlbXBDYXJkLmltZ19udW1iZXIpO1xuICB9XG5cbiAgdGhpcy52aXNpYmxlQ2FyZHMgPSBbXTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gc2hvdyB0aGUgZ2FtZSBvdmVyXG4gKi9cbk1lbW9yeUdhbWUucHJvdG90eXBlLmdhbWVPdmVyID0gZnVuY3Rpb24oKVxue1xuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RlbXBsYXRlX21lbW9yeV9nYW1lb3ZlclwiKS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgdGVtcGxhdGUucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlfdHVybnNcIikuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy50dXJucykpO1xuICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnlHYW1lO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IENvbGluIEZyYXBwZXJcbiAqIDIzLzEwLzIwMTZcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuZnVuY3Rpb24gV2luZG93KG9wdGlvbnMpXG57XG4gIHRoaXMuaWQgPSBvcHRpb25zLmlkIDsgLy8gdGhlIGlkIG9mIHRoZSB3aW5kb3dcbiAgdGhpcy5lbGVtZW50ID0gdW5kZWZpbmVkOyAvLyB0aGUgXCJ3aW5kb3dcIlxuICB0aGlzLnggPSBvcHRpb25zLnggfHwgMTA7IC8vXG4gIHRoaXMueSA9IG9wdGlvbnMueSB8fCAxMDtcbiAgdGhpcy50aXRsZSA9IG9wdGlvbnMudGl0bGUgO1xuICB0aGlzLmljb24gPSBvcHRpb25zLmljb24gO1xuICB0aGlzLmtleUFjdGl2YXRlZCA9IG9wdGlvbnMua2V5QWN0aXZhdGVkIHx8IGZhbHNlO1xuICB0aGlzLnpJbmRleCA9IG9wdGlvbnMuekluZGV4O1xufVxuXG4vKipcbiAqIERlc3Ryb3kgdGhlIHdpbmRvd1xuICovXG5XaW5kb3cucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpXG57XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbl9jb250ZW50XCIpLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XG59O1xuXG4vKipcbiAqIENyZWF0aW9uIG9mIHRoZSB3aW5kb3dcbiAqL1xuV2luZG93LnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24gKClcbntcbiAgLy9nZXQgdGhlIHRlbXBsYXRlIGFuZCBtb2RpZnkgaXQgdG8gdGhlIHBhcmFtc1xuICB2YXIgdGVtcGxhdGUgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZW1wbGF0ZV93aW5kb3dcIikuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gIHZhciB0ZW1wbGF0ZVdpbmRvdyA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoXCJkaXZcIik7XG4gIHRlbXBsYXRlV2luZG93LnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpOyAvLyBhZGQgdGhlIGlkIG9mIHRoZSB3aW5kb3dcbiAgdGVtcGxhdGVXaW5kb3cuc3R5bGUubGVmdCA9IHRoaXMueCArIFwicHhcIjsgLy8gc2V0IHRoZSBwb3N0aW9uXG4gIHRlbXBsYXRlV2luZG93LnN0eWxlLnRvcCA9IHRoaXMueSArIFwicHhcIjsgLy8gc2V0IHRoZSBwb3N0aW9uXG4gIHRlbXBsYXRlV2luZG93LnN0eWxlLnpJbmRleCA9IHRoaXMuekluZGV4OyAvLyBzZXQgdGhlIHpJbmRleCAodGhlIGZvY3VzKVxuXG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluX2NvbnRlbnRcIik7XG4gIHZhciBsYXVuY2hlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGF1bmNoZXJfbWVudVwiKTtcbiAgZWxlbWVudC5pbnNlcnRCZWZvcmUodGVtcGxhdGUsIGxhdW5jaGVyKTsgICAvL2luc2VydCB0aGUgbmV3IHdpbmRvdyBiZWZvcmUgbGF1bmNoZXIgaW4gdGhlIERPTVxuXG4gIC8vc2F2ZSB0aGUgZWxlbWVudCB0byB0aGUgb2JqZWN0XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGlzLmlkKTtcblxuICAvL2FkZCB0aXRsZSBhbmQgaWNvbiB0byB0aGUgd2luZG93XG4gIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd190aXRsZVwiKS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLnRpdGxlKSk7XG4gIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd19pY29uXCIpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaWNvbikpO1xufVxuXG4vKipcbiAqIE1pbmltaXplIHRoZSB3aW5kb3dcbiAqL1xuV2luZG93LnByb3RvdHlwZS5taW5pbWl6ZSA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJtaW5pbWl6ZWRcIik7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSB3aW5kb3dcbiAqL1xuV2luZG93LnByb3RvdHlwZS5jbGVhckNvbnRlbnRXaW5kb3cgPSBmdW5jdGlvbigpXG57XG4gIHZhciBjb250ZW50ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93X2NvbnRlbnRcIik7IC8vIGdldCB0aGUgY29udGVudCBvZiB0aGUgd2luZG93XG4gIHdoaWxlIChjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSlcbiAge1xuICAgIGNvbnRlbnQucmVtb3ZlQ2hpbGQoY29udGVudC5maXJzdENoaWxkKTsgLy8gcmVtb3ZlIGFsbCBvZiBoaXMgY2hpbGRcbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdyA7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgQ29saW4gRnJhcHBlclxuICogMjMvMTAvMjAxNlxuICovXG5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXNrdG9wID0gcmVxdWlyZShcIi4vRGVza3RvcFwiKTtcblxudmFyIGRlc2t0b3AgPSBuZXcgRGVza3RvcCgpO1xuZGVza3RvcC5zdGFydCgpOyAvLyBzdGFydCB0aGUgZGVza3RvcFxuIl19
