const express = require('express');
const router = express.Router()

const { Genre } = require('./../models/genre');
const { Movie } = require('./../models/movie');

router.get('/', async (req, res) => {
    const movies = await Movie.find({}).sort({name: 1});

    res.json(movies);
});

router.post('/', async (req, res) => {
    const genre = await Genre.findById(req.body.genre);

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    try {
        const result = await movie.save();

        res.json(result);
    } catch(err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;