const express = require('express')
const app = express()
const mongooose = require('mongoose');

mongooose.connect(process.env.DB_URL, (err) => err ? console.log(err) : console.log('Database Connected'))
const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');
const PORT = 3005;
const cors = require('cors')

const corsOptions = {
    origin: 'https://rohits-todo.onrender.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use('/', userRoutes)
app.use('/', todoRoutes);

app.listen(PORT, () => console.log('Server is on PORT', PORT));
