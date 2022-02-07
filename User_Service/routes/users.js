const express = require('express');
const router = express.Router();
const User = require('../models/user');
const logger = require('../../Logging_Library/logger')
var bodyParser = require('body-parser');

let reqID = "";
router.get('/reqID/:reqID', (req, res) => {
    reqID = req.params.reqID;
    res.statusCode(200);
})

// get all
router.get('/', async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);

    try {
        const users = await User.find();
        logger("User Service", "/", reqID, resID, "Success");
        res.json(users);
    } catch (err) {
        logger("User Service", "/", reqID, resID, "Error: couldn't find user");
        res.status(500).json({ message: err.message });
    }
});

// get one
router.get('/:username', getUser, (req, res) => {
    res.json(res.user);
});

// create one
router.post('/', bodyParser.json(), async (req, res) => { 
    let resID = Math.random().toString(36).substr(2, 9);

    const user = new User({
        username: req.body.username,
        password: req.body.password,
        APIToken: req.body.APIToken
    });

    try {
        const newUser = await user.save();
        logger("User Service", "/:username", req.body.reqID, resID, "Success");
        res.status(201).json(newUser);
    } catch (err) {
        logger("User Service", "/:username", req.body.reqID, resID, "Error: couldn't create user");
        res.status(400).json({ message: err.message });
    }
});

// update one (patch only updates what has changed)
router.patch('/:id', bodyParser.json(), getUser, async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);
    
    if(req.body.username != null) {
        res.user.username = req.body.username;
    }
    if(req.body.password != null) {
        res.user.password = req.body.password;
    }
    if(req.body.APIToken != null) {
        res.user.APIToken = req.body.APIToken;
    }
    if(req.body.rsvpVenue != null) {
        res.user.rsvpVenue = req.body.rsvpVenue;
    }
    try {
        const updatedUser = await res.user.save();
        logger("User Service", "/:id", req.body.reqID, resID, "Success");
        res.json(updatedUser);
    } catch (err) {
        logger("User Service", "/:id", req.body.reqID, resID, "Error: couldn't update user");
        res.status(400).json({ message: err.message });
    }
});

// delete one
router.delete('/:id', bodyParser.json(), getUser, async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);
    
    try {
        await res.user.remove();
        logger("User Service", "/:id", req.body.reqID, resID, "Success");
        res.json({ message: 'deleted user' });
    } catch (err) {
        logger("User Service", "/:id", req.body.reqID, resID, "Error: couldn't delete user");
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    let resID = Math.random().toString(36).substr(2, 9);

    try {
        // console.log(req.params.username)
        if (req.params.username)
        {
            user = await User.find({username: req.params.username}).exec();   
        }
        else if (req.params.id)
        {
            user = await User.findById(req.params.id);
        }

        // console.log(user)
        if(user == null) {
            logger("User Service", "/", reqID, resID, "Error: couldn't find user");
            return res.status(404).json({ message: 'cannot find user' });
        }
        logger("User Service", "/", reqID, resID, "Success");
    } catch (err) {
        logger("User Service", "/", reqID, resID, "Error: couldn't reach database");
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;