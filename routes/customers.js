const express = require('express')
const router = express.Router();

const Customer = require('./../models/customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find({}).sort({name: 1});

    res.json(customers);
});

router.post('/', async (req, res) => {
    const customer = new Customer(req.body);

    try {
        const result = await customer.save();

        res.status(201).json(result);
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send('Customer not found');

    res.json(customer);
});

router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.json(customer);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        res.json(customer);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

module.exports = router;