const mongoose = require('mongoose');
const Joi = require('joi')

const Schema = new mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean
});

function validateGenre(genre) {
    return Joi.validate(genre, {
        name: Joi.string().min(3).required()
    });
}

exports.Genre = mongoose.model('Genre', Schema);
exports.GenreSchema = Schema;
exports.validate = validateGenre;