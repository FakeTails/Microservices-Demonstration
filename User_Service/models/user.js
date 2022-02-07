const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    APIToken: {
        type: String,
        required: true
    },
    rsvpVenue: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);