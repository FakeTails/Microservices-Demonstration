const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    raverNum: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('RSVP', rsvpSchema);