const express = require('express');
const router = express.Router();
const Log = require('../models/log');
var bodyParser = require('body-parser');

// get all
router.get('/', async (req, res) => {
    try {
        const logs = await Log.find();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// getting all log messages related to a specific service
router.get('/serviceName/:serviceName', async (req, res) => {
    let logs;
    try {
        if (req.params.serviceName) {
            logs = await Log.find({serviceName: req.params.serviceName});
            res.json(logs);
        }
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// getting all log messages for a specific request ID
router.get('/requestID/:requestID', async (req, res) => {
    let logs;
    try {
        if (req.params.requestID) {
            logs = await Log.find({requestID: req.params.requestID});
            res.json(logs);
        }
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// getting all log messages for a specific response ID
router.get('/responseID/:responseID', async (req, res) => {
    let logs;
    try {
        if (req.params.responseID) {
            logs = await Log.find({responseID: req.params.responseID});
            res.json(logs);
        }
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// getting all log messages for a specific date
router.get('/timeStamp/:timeStamp', async (req, res) => {
    let logs;
    try {
        if (req.params.timeStamp) {
            logs = await Log.find({timeStamp: req.params.timeStamp});
            res.json(logs);
        }
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// create one
router.post('/', bodyParser.json(), async (req, res) => {
   
    function dateConverter(dateTimeStamp){
        let currDate = new Date(dateTimeStamp);
        let months = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];
        let month = String(months[currDate.getMonth()]);
        let date = String(currDate.getDate());
        let year = String(currDate.getFullYear());
        
        return month + "-" + date + "-" + year;
    }
    
    const log = new Log({
        timeStamp: dateConverter(Date.now()),
        serviceName: req.body.serviceName,
        loggingRoute: req.body.loggingRoute,
        requestID: req.body.requestID,
        responseID: req.body.responseID,
        statusMessage: req.body.statusMessage
    });

    try {
        const newLog = await log.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;