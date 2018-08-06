const mongoose = require('mongoose');

const { GenreSchema } = require('./genre');

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: GenreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0
    }
});

const Movie = mongoose.model('Movie', Schema);

exports.Movie = Movie;
exports.MovieSchema = Schema;