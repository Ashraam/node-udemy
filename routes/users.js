const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const router = express.Router();

const AuthMiddleware = require('../middleware/auth')
const { User, validate } = require('../models/user')

router.get('/me', AuthMiddleware, (req, res) => {
    res.json(req.user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    try {
        await user.save();

        user = _.pick(user, ['_id', 'name', 'email']);
        

        res.status(201).json({
            user,
            token: user.generateAuthToken()
        });
    } catch(err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;