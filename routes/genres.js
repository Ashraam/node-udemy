const express = require('express')
const mongoose = require('mongoose')

const AuthMiddleware = require('../middleware/auth')
const AdminMiddleware = require('../middleware/admin')
const ObjectIdMiddleware = require('../middleware/objectId')
const {Genre, validate} = require('../models/genre')

const router = express.Router()

router.get('/', async (req, res, next) => {
    const genres = await Genre.find({});
    res.json(genres);
});

router.post('/', AuthMiddleware, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name,
        isActive: true
    });

    const result = await genre.save();

    res.status(201).json(result);
});

router.get('/:id', [ObjectIdMiddleware], async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('Genre not found');

    res.json(genre);
});

router.put('/:id', [AuthMiddleware, ObjectIdMiddleware], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true  
    });

    res.json(genre);
});

router.delete('/:id', [AuthMiddleware, AdminMiddleware, ObjectIdMiddleware], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    res.json(genre);
});

module.exports = router;