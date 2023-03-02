const express = require('express')
const router = express.Router();
const Patient = require('../models/Patient');
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    try {
        let patients = await Patient.find()
        res.json({
            patients
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})
router.post('/', async (req, res) => {
    console.log(req.body)
    const { contact, name, address, pincode } = req.body
    if (!contact || !name || !address || !pincode) {
        res.status(400).json({
            message: "Provide proper details."
        })
    }
    else {
        try {

            const patient = await Patient.create({ ...req.body })
            res.json({
                patient
            })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
})

router.put('/:patientId', async (req, res) => {
    const { patientId } = req.params;
    const { contact, name, address, pincode } = req.body
    if (!contact || !name || !address || !pincode || !patientId) {
        res.status(400).json({
            message: "Provide proper details."
        })
    }
    else {

        try {

            const patient = await Patient.findOneAndUpdate({ _id: patientId }, { ...req.body })
            res.json({
                patient
            })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
})

router.delete('/:patientId', async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        res.status(400).json({
            message: "Provide proper details."
        })
    }
    else {

        try {

            const patient = await Patient.findOneAndDelete({ _id: patientId })
            res.json({
                patient
            })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
})

module.exports = router;