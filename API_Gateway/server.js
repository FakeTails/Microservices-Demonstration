const express = require('express')
var path = require('path')
const fetch = require("node-fetch")
var bodyParser = require('body-parser')
const logger = require('../Logging_Library/logger')
const { json } = require('body-parser')
const { stat } = require('fs')

// let reqID = Math.random().toString(36).substr(2, 9);
// logger("API Gateway", "/", reqID, "", "Sent");
// logger("API Gateway", "/", req.body.reqID, resID, "Sent");


const port = 3001
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) => {
  res.send('<h1>API Routes:</h1> <p>api/ - Gets all user data, VERY SECURE, TRUST ME.</p> <p>api/venues - gets all venues </p>')
})

let reqID = "";
app.get('/api/reqID/:reqID', async (req, res) => {
  reqID = req.params.reqID;
  res.statusCode(200);
})

// show all users
app.get('/api/', async (req, res) => {

  logger("API Gateway", "/", reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);
  await fetch(`http://localhost:3002/api/users/reqID/${reqID}`)
  res.json(await fetch("http://localhost:3002/api/users/")
  .then((data) => {
      //logging data retrieved for debugging
      // console.log(data);
        
      return data.json()
    })
    .then((json) => {
      //logging json for debugging
      // console.log(json[0].username)
      logger("API Gateway", "/", reqID, resID, "Success");
      return json
    })
    .catch((error) => {
      console.error('Error:', error)
      logger("API Gateway", "/", reqID, "", "Error: User Service Unreachable");
    })
  )
})

// login a user
app.post('/api/login', bodyParser.json(), async (req, res) => {

  let reqID = req.body.reqID;

  logger("API Gateway", "/api/login", reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);

  await fetch(`http://localhost:3002/api/users/reqID/${reqID}`)
  res.json(await fetch(`http://localhost:3002/api/users/${req.body.user.username}`)
  .then((data) => {
      //logging data retrieved for debugging
      // console.log(data);
        
      return data.json()
    })
    .then((json) => {
      //logging json for debugging
      console.log(json)
      logger("API Gateway", "/api/login", reqID, resID, "Success");

      return json
    })
    .catch((error) => {
      console.error('Error:', error)
      logger("API Gateway", "/api/users", reqID, resID, "Error: User Service Unreachable");

    })
  )
})

// register a user
app.post('/api/register', bodyParser.json(), async (req, res) => {
  
  logger("API Gateway", "/api/register", req.body.reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);  
  
  res.json(await fetch(`http://localhost:3002/api/users/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
            username: req.body.user.username,
            password: req.body.user.password,
            APIToken: req.body.user.APIToken,
            reqID: req.body.reqID
        })
      })
    .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
        logger("API Gateway", "/api/register", req.body.reqID, resID, "Success");

        return data.json()
      })
      .then((json) => {
        //logging json for debugging
        // console.log(json)

        return json
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("API Gateway", "/api/register", req.body.reqID, resID, "Error: User Service Unreachable");
      })
    )
})

// return all venues
app.get('/api/venues', async (req, res) => {

  logger("API Gateway", "/api/venues", reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);  

  await fetch(`http://localhost:3003/api/venues/reqID/${reqID}`)
  res.json(await fetch(`http://localhost:3003/api/venues/`)
  .then((data) => {
      //logging data retrieved for debugging
      //console.log(data);
        
      return data.json()
    })
    .then((json) => {
      //logging json for debugging
      console.log(json)
      logger("API Gateway", "/api/venues", reqID, resID, "Success");

      return json
    })
    .catch((error) => {
      console.error('Error:', error)
      logger("API Gateway", "/api/venues", reqID, resID, "Error: Venue Service Unreachable");

    })
  )
})

// return a venue by name
app.get('/api/venues/:name', async (req, res) => {
  
  logger("API Gateway", "/api/venues/:name", reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);  

  await fetch(`http://localhost:3003/api/venues/reqID/${reqID}`)
  res.json(await fetch(`http://localhost:3003/api/venues/${req.params.name}`)
  .then((data) => {
      //logging data retrieved for debugging
      //console.log(data);
        
      return data.json()
    })
    .then((json) => {
      //logging json for debugging
      console.log(json)
      logger("API Gateway", "/api/venues/:name", reqID, resID, "Success");

      return json
    })
    .catch((error) => {
      console.error('Error:', error)
      logger("API Gateway", "/api/venues/:name", reqID, resID, "Error: Venue Service Unreachable");

    })
  )
})

// rsvp a user to a venue
app.post('/api/rsvp', bodyParser.json(), async (req, res) => {

  let currentSeats = -1;
  let occupancy = -1;
  let venueID = "";
  let userID = "";

  logger("API Gateway", "/api/rsvp", req.body.reqID, "", "Sent");
  let resID = Math.random().toString(36).substr(2, 9);  

  await fetch(`http://localhost:3003/api/venues/reqID/${reqID}`)
  // get the venueID, currentSeats, and occupancy.
  await fetch(`http://localhost:3003/api/venues/${req.body.venue}`, {
    body: JSON.stringify({
      reqID: req.body.reqID
    })
  })
  .then((data) => {
      //logging data retrieved for debugging
      //console.log(data);
        
      return data.json()
    })
    .then((json) => {
      //logging json for debugging
      // console.log(json[0])

      if (json[0].numAvailableSeats > 0)
      {
        venueID = json[0]._id
        currentSeats = json[0].numAvailableSeats;
        occupancy = json[0].occupancy;
      }

      return json
    })
    .catch((error) => {
      console.error('Error:', error)
      logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: Venue Service Unreachable");
    })

    if (currentSeats != -1)
    {

      await fetch(`http://localhost:3004/api/rsvps/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
          username: req.body.username,
          venue: req.body.venue,
          raverNum: ((occupancy - currentSeats) + 1),
          reqID: req.body.reqID
        })
      })
    .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
          
        return data.json()
      })
      .then((json) => {
        //logging json for debugging
        // console.log(json)

        if (json.raverNum != ((occupancy - currentSeats) + 1))
        {
          res.message("New document for RSVP database didn't create");
          logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: New document for RSVP database wasn't created");

        }
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: rsvp Service Unreachable");
      })


      // update the currentSeats
      await fetch(`http://localhost:3003/api/venues/${venueID}`, {
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({ numAvailableSeats: currentSeats-1, reqID: req.body.reqID })
      })
      .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
          
        return data.json()
      })
      .then((json) => {
        //logging data retrieved for debugging    
        // console.log(json) 

        if (json.numAvailableSeats != currentSeats-1)
        {
          logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: numAvailableSeats didn't update");
          res.message("numAvailableSeats didn't update");
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: Venue Service Unreachable");
      });

      // get the userID
      await fetch(`http://localhost:3002/api/users/${req.body.username}`)
      .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
          
        return data.json()
      })
      .then((json) => {
        //logging json for debugging
        // console.log(json)

        userID = json[0]._id
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: User Service Unreachable");
      })

      if (userID != "")
      {
        // update the users RSVPVenue
        await fetch(`http://localhost:3002/api/users/${userID}`, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify({ rsvpVenue: req.body.venue })
        })
        .then((data) => {
          //logging data retrieved for debugging
          // console.log(data);
            
          return data.json()
        })
        .then((json) => {
          //logging data retrieved for debugging    
          // console.log(json) 

          if (json.rsvpVenue != req.body.venue)
          {
            logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: rsvpVenue didn't update");
            res.message("rsvpVenue didn't update");
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: User Service Unreachable");
        });
      }
      else
      {
        res.json({ message: 'Error in username lookup' });
        logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: Error in username lookup");
      }
      
    res.json({ message: 'Success' });
    logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Success");

    }
    else
    {
      res.json({ message: 'Not enough seats' });
      logger("API Gateway", "/api/rsvp", req.body.reqID, resID, "Error: Not enough seats");
    }
})

// 404 catch-all handler
app.use(function(req, res, next){
    res.status(404)
    res.json({
        "status" : "error",
        "message" : "This page can not be found."
    })
  })
  
// 500 error handler
app.use(function(error, req, res, next){
    console.error(error.stack);
    res.status(500)
    res.json({
        "status" : "error",
        "message" : "An internal error has occurred."
    })
  })

app.listen(port, () => {
  console.log(`visit http://localhost:${port}`)
})
