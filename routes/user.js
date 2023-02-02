const express = require('express')
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

const secret = "This is my secret";
router.post("/register", async (req, res) => {
    // 1. Check whether users already exists or not
    // 2. USers exists. Send message like user already there
    // 3. New user then create it
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                status: "Failed",
                message: "User already exists with the given email"
            })
        }
        bcrypt.hash(password, 10, async function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                })
            }

            user = await User.create({
                username: getUsername(email),
                email: email,
                password: hash
            });
            // Create a token after login 
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: user._id
            }, secret);
            res.json({
                status: "Success",
                message: "User succesfully registered.",
                user,
                token
            })
        });

    } catch (e) {
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.post("/login", async (req, res) => {
    try {

        // 1. Firt check whether there is an account with the given email
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({
                status: "Failed",
                message: "There is no account with the entered email"
            })
        }
        // If user already there then compare the pasword 
        // Load hash from your password DB.
        bcrypt.compare(password, user.password, function (err, result) {
            // result == true
            if (err) {
                return res.status(409).json({
                    status: "Failed",
                    message: "Password didn't match."
                })
            }
            if (result) {
                // Create a token after login 
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                }, secret);


                return res.json({
                    status: "Success",
                    message: "Login Succesful",
                    token,
                    user
                })
            } else {
                return res.status(409).json({
                    status: "Failed",
                    message: "Invalid credentials"
                })
            }

        });

    } catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }
});


function getUsername(email) {
    let name = '';
    let i = 0;
    while (email[i] != "@" && i < email.length) {
        name += email[i];
        i++
    }
    return name
}
module.exports = router;