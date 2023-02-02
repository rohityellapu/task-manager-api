const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;