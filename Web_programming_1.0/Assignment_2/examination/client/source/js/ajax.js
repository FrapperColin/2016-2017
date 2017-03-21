/**
 * Created by Colin FRAPPER
 * Date : 26/09/2016
 */


/**
 * Function GetHttpRequest
 * @param config
 * @param callback
 */
function GetHttpRequest(config, callback)
{
  var r = new XMLHttpRequest();

  //add eventlistener for response
  r.addEventListener("load", function()
  {

    if (r.status >= 400)
    {
      //got error, call with errorcode
      callback(r.status);
    }

    //call the callback function with responseText
    callback(null, r.responseText);
  });

  //open a request from the config
  r.open(config.method, config.url);

  if (config.data)
  {
    //send the data as JSON to the server
    r.setRequestHeader("Content-Type", "application/json");
    r.send(JSON.stringify(config.data));
  }
  else  //send request
  {
    r.send(null);
  }
}

module.exports.GetHttpRequest = GetHttpRequest;
