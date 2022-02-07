const fetch = require("node-fetch")

module.exports = (serviceName, loggingRoute, requestID, responceID, statusMessage) =>
{
    fetch("http://localhost:3005/logger", {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceName: serviceName,
        loggingRoute: loggingRoute,
        requestID: requestID,
        responceID: responceID,
        statusMessage: statusMessage
        })
      })
      .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
        return data.json()
      })
      .then((json) => {
        //logging data retrieved for debugging    
        console.log(json)    
      })
      .catch((error) => {
        console.error('Error:', error)
      });
}