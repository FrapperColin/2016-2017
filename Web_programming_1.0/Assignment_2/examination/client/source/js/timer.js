/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

/**
 * Constructor Timer
 * @param content
 * @param element
 * @param time
 * @constructor Timer
 */
function Timer(content, element, time)
{
  this.time = time;
  this.element = element;
  this.content = content;
  this.startTime = new Date().getTime();
  this.interval = undefined;
}

/**
 * Function start
 * @role starts an interval for the timer
 */
Timer.prototype.start = function()
{
  this.interval = setInterval(this.run.bind(this), 100);
};

/**
 * Function run
 * @role
 */
Timer.prototype.run = function()
{
  var atm = new Date().getTime();

  var diff = (atm - this.startTime) / 1000; //difference from start to at the moment (atm)

  var showTime = this.time - diff;  // show countdown

  if (diff >= this.time)
  {
    showTime = 0;
    clearInterval(this.interval);
    this.content.gameOver("timesUP"); // Times up
  }
  if (showTime <= 10) // show decimals if under 10 seconds
  {
    this.element.classList.add("color"); // display red Timer
    this.print("Time left : " + showTime.toFixed(1));
  }
  else
  {
    this.print("Time left : " + showTime.toFixed(0));
  }
};

/**
 * Function stop
 * @returns {number}, difference in seconds
 * @role stop the timer
 */
Timer.prototype.stop = function()
{
  clearInterval(this.interval);
  var now = new Date().getTime();
  return (now - this.startTime) / 1000;
};

/**
 * Function print
 * @param diff
 * @role replace
 */
Timer.prototype.print = function(diff)
{
  this.element.replaceChild(document.createTextNode(diff), this.element.firstChild);
};

module.exports = Timer;
