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
