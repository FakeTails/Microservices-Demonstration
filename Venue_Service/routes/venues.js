const express = require('express');
const router = express.Router();
const Venue = require('../models/venue');
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
        const venues = await Venue.find();
        logger("Venue Service", "/", reqID, resID, "Success");
        res.json(venues);
    } catch (err) {
        logger("Venue Service", "/", reqID, resID, "Error: Couldn't find venue");
        res.status(500).json({ message: err.message });
    }
});

// get one
router.get('/:name', getVenue, (req, res) => {
    res.json(res.venue);
});

// create one
router.post('/', bodyParser.json(), async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);

    const venue = new Venue({
        name: req.body.name,
        occupancy: req.body.occupancy,
        numAvailableSeats: req.body.numAvailableSeats
    });

    try {
        const newVenue = await venue.save();
        logger("Venue Service", "/", req.body.reqID, resID, "Success");
        res.status(201).json(newVenue);
    } catch (err) {
        logger("Venue Service", "/", req.body.reqID, resID, "Error: Couldn't create venue");
        res.status(400).json({ message: err.message });
    }
});

// update one (patch only updates what has changed)
router.patch('/:id', bodyParser.json(), getVenue, async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);
    
    if(req.body.name != null) {
        res.venue.name = req.body.name;
    }
    if(req.body.occupancy != null) {
        res.venue.occupancy = req.body.occupancy;
    }
    if(req.body.numAvailableSeats != null) {
        res.venue.numAvailableSeats = req.body.numAvailableSeats;
    }
    try {
        const updatedVenue = await res.venue.save();
        logger("Venue Service", "/:id", req.body.reqID, resID, "Success");
        res.json(updatedVenue);
    } catch (err) {
        logger("Venue Service", "/:id", req.body.reqID, resID, "Error: Couldn't update venue");
        res.status(400).json({ message: err.message });
    }
});

// delete one
router.delete('/:id', bodyParser.json(), getVenue, async (req, res) => {
    let resID = Math.random().toString(36).substr(2, 9);
    
    try {
        await res.venue.remove();
        logger("Venue Service", "/:id", req.body.reqID, resID, "Success");
        res.json({ message: 'deleted venue' });
    } catch (err) {
        logger("Venue Service", "/:id", req.body.reqID, resID, "Error: Couldn't delete venue");
        res.status(500).json({ message: err.message });
    }
});

async function getVenue(req, res, next) {
    let venue;
    let resID = Math.random().toString(36).substr(2, 9);

    try {
        if (req.params.name)
        {
            venue = await Venue.find({name: req.params.name}).exec();
            
        }
        else if (req.params.id)
        {
            venue = await Venue.findById(req.params.id);
        }

        if(venue == null) {
            logger("Venue Service", "/", reqID, resID, "Error: Couldn't find venue");
            return res.status(404).json({ message: 'cannot find venue' });
        }
        logger("Venue Service", "/", reqID, resID, "Success");
    } catch (err) {
        logger("Venue Service", "/", reqID, resID, "Error: Couldn't access venue database");
        return res.status(500).json({ message: err.message });
    }

    res.venue = venue;
    next();
}

module.exports = router;