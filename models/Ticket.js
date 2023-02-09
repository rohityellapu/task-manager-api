const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    registrant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration'
    },

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }

})

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;