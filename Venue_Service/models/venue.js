const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    occupancy: {
        type: String,
        required: true
    },
    numAvailableSeats: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Venue', venueSchema);