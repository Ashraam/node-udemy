const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const router = express.Router();

const { User } = require('../models/user')

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const check = await bcrypt.compare(req.body.password, user.password);
    if (!check) return res.status(401).send('Invalid email or password');

    const token = user.generateAuthToken();
    
    res.json(token);
});

function validate(data) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    };

    return Joi.validate(data, schema);
}

module.exports = router;