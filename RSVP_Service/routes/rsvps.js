const express = require('express');
const router = express.Router();
const logger = require('../../Logging_Library/logger')
const RSVP = require('../models/rsvp');
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
        const rsvps = await RSVP.find();
        logger("RSVP Service", "/", reqID, resID, "Success");
        res.json(rsvps);
    } catch (err) {
        logger("RSVP Service", "/", reqID, resID, "Error: couldn't find file");
        res.status(500).json({ message: err.message });
    }
});

// create one
router.post('/', bodyParser.json(), async (req, res) => {
    
    let resID = Math.random().toString(36).substr(2, 9);

    const rsvp = new RSVP({
        username: req.body.username,
        venue: req.body.venue,
        raverNum: req.body.raverNum
    });

    try {
        const newRSVP = await rsvp.save();
        logger("RSVP Service", "/", req.body.reqID, resID, "Success");
        res.status(201).json(newRSVP);
    } catch (err) {
        logger("RSVP Service", "/", req.body.reqID, resID, "Error: couldn't create file");
        res.status(400).json({ message: err.message });
    }
});

// update one (patch only updates what has changed)
router.patch('/:id', bodyParser.json(), getRSVP, async (req, res) => {

    let resID = Math.random().toString(36).substr(2, 9);

    if(req.body.username != null) {
        res.rsvp.username = req.body.username;
    }
    if(req.body.venue != null) {
        res.rsvp.venue = req.body.venue;
    }
    if(req.body.raverNum != null) {
        res.rsvp.raverNum = req.body.raverNum;
    }
    try {
        const updatedRSVP = await res.rsvp.save();
        logger("RSVP Service", "/:id", req.body.reqID, resID, "Success");
        res.json(updatedRSVP);
    } catch (err) {
        logger("RSVP Service", "/:id", req.body.reqID, resID, "Error: couldn't update file");
        res.status(400).json({ message: err.message });
    }
});

// delete one
router.delete('/:id', bodyParser.json(), getRSVP, async (req, res) => {
    
    let resID = Math.random().toString(36).substr(2, 9);

    try {
        await res.rsvp.remove();
        logger("RSVP Service", "/:id", req.body.reqID, resID, "Success");
        res.json({ message: 'deleted rsvp' });
    } catch (err) {
        logger("RSVP Service", "/:id", req.body.reqID, resID, "Error: couldn't remove file");
        res.status(500).json({ message: err.message });
    }
});

async function getRSVP(req, res, next) {
    let rsvp;

    try {
        // console.log(req.params.username)
        if (req.params.username)
        {
            
            rsvp = await RSVP.find({username: req.params.username}).exec();
        }
        else if (req.params.id)
        {
            rsvp = await RSVP.findById(req.params.id);
        }
        // console.log(rsvp)

        if(rsvp == null) {
            logger("RSVP Service", "/", reqID, resID, "Error: couldn't find file");
            return res.status(404).json({ message: 'cannot find rsvp' });
        }

        logger("RSVP Service", "/", reqID, resID, "Success");

    } catch (err) {
        logger("RSVP Service", "/", reqID, resID, "Error: couldn't access database");
        return res.status(500).json({ message: err.message });
    }

    res.rsvp = rsvp;
    next();
}

module.exports = router;