const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    contact: {
        type: Number,
        required: true,

    },
    address: {
        type: String,
        required: true,

    },
    pincode: {
        type: Number,
        required: true,

    },

})

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;