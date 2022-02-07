const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timeStamp: {
        type: String,
        // it is required but we pass in Date.now() so it isn't required
        // required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    // URL location that called the service 
    loggingRoute: {
        type: String,
        required: true
    },
    requestID: {
        type: String
    },
    responseID: {
        type: String
    },
    // success or failure message
    statusMessage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Log', logSchema);