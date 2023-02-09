const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration'
    }]

})

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;