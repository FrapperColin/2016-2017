/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";


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

function Window(options)
{
  this.id = options.id ; // the id of the window
  this.element = undefined; // the "window"
  this.x = options.x || 400; //
  this.y = options.y || 400;
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
  console.log(template);
  var templateWindow = template.querySelector("div");
  templateWindow.setAttribute("id", this.id); // add the id of the window
  templateWindow.style.left = this.x + "px"; // set the postion
  templateWindow.style.top = this.y + "px"; // set the postion
  templateWindow.style.zIndex = this.zIndex; // set the zIndex (the focus)

  var element = document.querySelector("#main_content");
  console.log("ELEMNT : "+ element);
  var launcher = document.querySelector(".launcher_menu");
  console.log("ELEMrereeNT : "+ launcher);
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
    case "Chat":
    {
      newApp = new ChatApp(appOptions);
      newApp.start();

      break;
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
  this.server = "ws://localhost:8080/Project_Timeline/web";
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
  this.socket = new WebSocket(this.server);

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
 * @param event - the data string from server
 */
Chat.prototype.newMessageFromServer = function(event)
{
  var data = JSON.parse(event.data);
  console.log("message from server " + event.data);
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
      };

      //send the object to server
      this.socket.send(JSON.stringify(msg));

      //disable send the button and reset the form
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

  console.log("L'username" + this.username);
  console.log("L'envoyeur" + data.username);
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

var desktop = new Desktop();
desktop.start(); // start the desktop

