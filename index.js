const express = require('express')
const app = express()
const mongooose = require('mongoose');
require('dotenv').config();
mongooose.connect('mongodb://localhost:27017/taskManager', (err) => err ? console.log(err) : console.log('Database Connected'))

const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');
const eventRoutes = require('./routes/event');
const PORT = 3005;
const cors = require('cors')

var whitelist = ['https://event-management-byrohit.onrender.com',
    'https://rohits-todo.onrender.com',
    'http://localhost:3000'
]
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use('/', userRoutes)
app.use('/', todoRoutes);
app.use('/event', eventRoutes)
app.listen(PORT, () => console.log('Server is on PORT', PORT));
