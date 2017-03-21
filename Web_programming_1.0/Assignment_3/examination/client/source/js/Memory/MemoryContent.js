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
