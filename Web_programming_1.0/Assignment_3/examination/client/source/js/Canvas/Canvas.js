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
