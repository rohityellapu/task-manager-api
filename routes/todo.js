const express = require('express')
const router = express.Router();
const User = require('../models/User')
const Todo = require('../models/Todo');

router.use(express.json());
router.use(express.urlencoded({ extended: true }))

router.get('/todos/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({
            message: "Provide user credentials"
        })
    }
    try {
        let user = await User.findOne({ _id: userId }).populate('todos')
        res.json({
            todos: user.todos
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})
router.post('/todos/:userId', async (req, res) => {
    const { userId } = req.params;
    const { activity } = req.body;
    if (!userId || !activity) {
        res.status(400).json({
            message: "Provide proper details."
        })
    }
    try {
        let user = await User.findOne({ _id: userId })
        let newTodo = await Todo.create({ activity: activity, user: user._id });
        user.todos.push(newTodo._id);
        await user.save();
        res.json(newTodo);
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put('/todos/:userId', async (req, res) => {
    const { userId } = req.params;
    const { todo } = req.body;
    if (!userId || !todo) res.status(400).json({ message: 'Provide full details.' });
    else {

        try {

            let task = await Todo.findOne({ _id: todo._id });
            task.timeTaken += todo.timeTaken;
            task.status = todo.status;
            let updated = await task.save();
            res.json({ updated });

        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
})

router.delete('/todos/:userId/:todoId', async (req, res) => {
    const { userId, todoId } = req.params;
    if (!userId || !todoId) res.status(400).json({ message: 'Provide full details.' });
    else {
        try {

            let todo = await Todo.findOne({ _id: todoId });
            let user = await User.findOne({ _id: userId });
            user.todos = user.todos.filter(t => t != todo._id);
            await user.save();
            await Todo.findOneAndDelete({ _id: todo._id })
            res.json({ message: 'Successfully deleted' })
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message })
        }
    }
})

module.exports = router;