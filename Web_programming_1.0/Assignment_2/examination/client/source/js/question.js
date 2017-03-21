/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */

/**
 * Constructor Question
 * @param obj
 * @constructor Question
 */
function Question(obj)
{
  this.id = obj.id;
  this.question = obj.question;
  this.alt = obj.alternatives;
}

/**
 * Function print
 * @role call function to display question
 */
Question.prototype.print = function()
{
  if (this.alt) // if the question use alternative response
  {
    this.printAltQuestion();
  }
  else // classic question
  {
    this.printQuestion();
  }
  document.querySelector("input").focus(); // so we can use keyboard

};

/**
 * Function clearElement
 * @param element
 * @role clear lastchild of the element passed in parameter
 */
Question.prototype.clearElement = function(element)
{
  while (element.hasChildNodes())
  {
    element.removeChild(element.lastChild);
  }
};

/**
 * Function printAltQuestion
 * @role print checkbox to the page
 */
Question.prototype.printAltQuestion = function()
{
  var template = document.querySelector("#template_question_alt").content.cloneNode(true); // call template
  template.querySelector(".questionHead").appendChild(document.createTextNode("Question : " + this.question));

  var inputFrag = this.getAltFrag(); // get the fragment for alternatives
  template.querySelector(".questionForm").insertBefore(inputFrag, template.querySelector(".submit")); // insere checkbox before submit
  document.querySelector("#context").appendChild(template);
};


/**
 * Function getAltFrag
 * @returns {DocumentFragment}
 * @role return the fragment for alternatives (checkbox in this case)
 */
Question.prototype.getAltFrag = function()
{
  var inputFrag = document.createDocumentFragment();
  var input;
  var label;
  var first = true;

  for (var alt in this.alt) // for each alt for the question
  {
    if (this.alt.hasOwnProperty(alt))// if Json-file(storage) has a property named alt
    {
      input = document.querySelector("#template_alternative").content.cloneNode(true); //call template
      if (first) // if the checkbox is "clicked"
      {
        input.querySelector("input").setAttribute("checked", "checked");
        first = false;
      }
      input.querySelector("input").setAttribute("value", alt);
      label = input.querySelector("label");
      label.appendChild(document.createTextNode(this.alt[alt])); // create a text node with the "named of alt"

      inputFrag.appendChild(input);
    }
  }
  return inputFrag;
};


/**
 * Function printQuestion
 * @role displat the question
 */
Question.prototype.printQuestion = function()
{
  var template = document.querySelector("#template_question").content.cloneNode(true); // call template
  template.querySelector(".questionHead").appendChild(document.createTextNode("Question : " + this.question));
  document.querySelector("#context").appendChild(template);
  document.querySelector("input").focus();
};

module.exports = Question;
