const express = require('express')
var path = require('path')
const creds = require('./credentials')
const fetch = require("node-fetch")
const logger = require('../Logging_Library/logger')
var bodyParser = require('body-parser')

// let reqID = Math.random().toString(36).substr(2, 9);
// logger("Web Server", "/", reqID, "", "Sent");

const port = 3000
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// Set up sessions
const session = require("express-session")
// const { post } = require('../User_Service/routes/users')
const { randomBytes } = require('crypto')
app.use(session(creds.session));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/login', async (req, res) => {
  if (req.session.loggedin)
  {
    res.redirect('/rsvp')
  }
  else
  {

    let reqID = Math.random().toString(36).substr(2, 9);
    console.log("here");
    logger("Web Server", "/login", reqID, "", "Sent");

    // console.log(typeof(req.query.password) + " " + req.query.password)
    if (typeof(req.query.username) != "undefined" && typeof(req.query.password) != "undefined")
    {
      await fetch("http://localhost:3001/api/login", {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
          user: {
              username: req.query.username,
              password: req.query.password
          },
          reqID: reqID
        })
      })
      .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
        return data.json()
      })
      .then((json) => {
        //logging data retrieved for debugging    
        // console.log(json)    

        if (typeof(json[0]) != "undefined")
        {
          if (json[0].username == req.query.username && json[0].password == req.query.password) // valid login
          {
            req.session.loggedin = true;
            req.session.username = json[0].username;
            req.session.APIToken = json[0].APIToken;
            res.redirect('/rsvp')
          }
          else
          {
            res.redirect('/login')
          }
        }
        else
        {
          res.redirect('/login')
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("Web Server", "/login", reqID, "", "Error: API unreachable");
      });
    }
    else
    {
      res.sendFile(path.join(__dirname + '/views/login.html'))
    }
  }
})

app.get('/register', async (req, res) => {
  if (req.session.loggedin)
  {
    res.redirect('/rsvp')
  }
  else
  {
    if (typeof(req.query.username) != "undefined" && typeof(req.query.password) != "undefined" && 
      typeof(req.query.username) != "null" && typeof(req.query.password) != "null")
    {
      let reqID = Math.random().toString(36).substr(2, 9);
      logger("Web Server", "/register", reqID, "", "Sent");

      await fetch("http://localhost:3001/api/register", {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
          user: {
            username: req.query.username,
            password: req.query.password,
            APIToken: randomBytes(16).toString("hex")
          },
          reqID: reqID
        })
      })
      .then((data) => {
        //logging data retrieved for debugging
        // console.log(data);
          
        return data.json()
      })
      .then((json) => {
        //logging data retrieved for debugging    
        // console.log(json) 
        res.redirect('/login')   
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("Web Server", "/register", reqID, "", "Error: API unreachable");
      });
    }
    else
    {
      res.sendFile(path.join(__dirname + '/views/register.html'))
    }
  }
})

app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.username = "";
    req.session.APIToken = "";
    res.sendFile(path.join(__dirname + '/views/login.html'))
})

app.get('/rsvp', async (req, res) => {
  let search = false;
  let reqID = Math.random().toString(36).substr(2, 9);

  if (req.session.loggedin)
  {
    let venues;
    if (req.query.search)
    {
      logger("Web Server", "/rsvp", reqID, "", "Sent");

      search = true;
      let found = true;
      await fetch(`http://localhost:3001/api/reqID/${reqID}`)
      venues = (await fetch(`http://localhost:3001/api/venues/${req.query.search}`)
        .then((data) => {
          //logging data retrieved for debugging
          // console.log(data);
            
          return data.json()
        })
        .then((json) => {
          //logging json for debugging
          console.log(json)
    
          if (typeof(json[0]) == "undefined")
          {
            found = false;
            return json;
          }

          if (json.status == "error")
          {
            found = false;
          }

          return json
        })
        .catch((error) => {
          console.error('Search error:', error)
          found = false;
          logger("Web Server", "/rsvp", reqID, "", "Error: API unreachable");
        })
      )
  
        if (found)
        {
          return res.render("rsvp", { venues: venues, results: search })
        }
    }

    venues = (await fetch(`http://localhost:3001/api/venues/`)
      .then((data) => {
        //logging data retrieved for debugging
        //console.log(data);
          
        return data.json()
      })
      .then((json) => {
        //logging json for debugging
        // console.log(json)
  
        return json
      })
      .catch((error) => {
        console.error('Error:', error)
        logger("Web Server", "/rsvp", reqID, "", "Error: API unreachable");
      })
    );

    if (search)
    {
      res.render("rsvp", { venues: venues, noResults: true})
    }
    else
    {
      res.render("rsvp", { venues: venues, noResults: false})
    }
    
  }
  else
  {
    res.redirect('/login')
  }
    
})

app.get('/checkout', (req, res) => {
  if (req.session.loggedin)
  {
    if (req.query.venue)
    {
      res.render("checkout", { venue: req.query.venue })
    }
    else
    {
      res.render("checkout", { venue: "Error" })
    }
  }
  else
  {
    res.redirect('/login')
  }
})

app.get('/checkout/confirm', async (req, res) => {
  if (req.session.loggedin)
  {
    if (req.query.venue)
    {
      let reqID = Math.random().toString(36).substr(2, 9);
      logger("Web Server", "/checkout/confirm", reqID, "", "Sent");

      await fetch("http://localhost:3001/api/rsvp", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: req.session.username,
            venue: req.query.venue,
            reqID: reqID
          })
        })
        .then((data) => {
          //logging data retrieved for debugging
          // console.log(data);
            
          return data.json()
        })
        .then((json) => {
          //logging data retrieved for debugging    
          // console.log(json) 

          if (json.message != "Success")
          {
            console.log("Json doesn't equal success: " + json.message)
          }
        })
        .catch((error) => {
            console.error('Error:', error)
            logger("Web Server", "/checkout/confirm", reqID, "", "Error: API unreachable");

        });

        res.sendFile(path.join(__dirname + '/views/thankyou.html'))
    }
    else
    {
      res.redirect('/')
    }
  }
  else
  {
    res.redirect('/login')
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
