const express = require('express')
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registrations');
const Ticket = require('../models/Ticket')
const bodyParser = require('body-parser');
const multer = require('multer');
const { storage } = require('./cloudinary');
const ShortUniqueId = require('short-unique-id');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())


const parser = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        let events = await Event.find().populate({ path: 'registrations' })
        res.json({
            message: 'Success',
            events
        })
    } catch (err) {
        console.log(err)
        res.json({ err: err.message })
    }
})
router.post('/', parser.single('image'), async (req, res) => {
    const { name, address, info, startTime, endTime } = req.body;

    try {
        let newEvent = await Event.create({
            name: name,
            address: address,
            startTime: startTime,
            endTime: endTime,
            info: info,
            image: req.file.path
        })
        console.log(newEvent);
        res.json({
            message: 'Success',
            newEvent
        })

    } catch (err) {
        console.log(err)
        res.json({ err: err.message })
    }

})

router.post('/register', async (req, res) => {
    const { name, email, event } = req.body;
    try {
        let oldUser = await Registration.findOne({ email: email }).populate('events.ticket');
        if (oldUser) {
            let alreadyRegistered = oldUser.events.every((e) => e.event != event._id)
            if (alreadyRegistered) {
                let eve = await Event.findOne({ _id: event._id })
                let newNumber = new ShortUniqueId({ length: 6 })()
                let newTicket = new Ticket({ number: newNumber, event: event._id })

                let newEve = { event: event._id, ticket: newTicket._id };
                oldUser.events.push(newEve);
                newTicket.registrant = oldUser._id;
                eve.registrations.push(oldUser._id)

                await eve.save()
                await newTicket.save();
                await oldUser.save();
                res.json({
                    message: 'Success',
                    oldUser,
                    newTicket
                })

            }
            else {
                res.status(409).json({
                    status: "Failed",
                    message: "User already exists with that email",
                    oldUser
                })
            }
        } else {
            let eve = await Event.findOne({ _id: event._id })
            let newNumber = new ShortUniqueId({ length: 6 })()
            let newTicket = new Ticket({ number: newNumber, event: event._id })
            let newUser = new Registration({
                name: name,
                email: email,
            })
            let newEve = { event: event._id, ticket: newTicket._id };
            newUser.events.push(newEve);
            newTicket.registrant = newUser._id;
            eve.registrations.push(newUser._id)

            await eve.save()
            await newTicket.save();
            await newUser.save();
            res.json({
                message: 'Success',
                newUser,
                newTicket
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ err: err.message })
    }

})
router.post('/join', async (req, res) => {
    const { ticketNum } = req.body;
    console.log(req.body);
    try {
        let ticket = await Ticket.findOne({ number: ticketNum })
        if (ticket) {
            let user = await Registration.findOne({ _id: ticket.registrant });
            for (let i in user.events) {
                if (ticket._id.equals(user.events[i].ticket)) {
                    user.events[i].joined = true;
                }
            }
            await user.save();
            console.log(user);
            res.json({ user })
        } else {
            res.status(403).json({
                message: "Ticket not found"
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ err: err.message })
    }
})

module.exports = router;