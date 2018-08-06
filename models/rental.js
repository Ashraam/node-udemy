const mongoose = require('mongoose')
const moment = require('moment')
const Joi = require('joi')

const Schema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: String,
            dailyRentalRate: Number
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

Schema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

Schema.methods.return = function() {
    this.dateReturned = Date.now();
    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
    return this.save();
}

const Rental = mongoose.model('Rental', Schema);

function validate(data) {
    const schema = {
        customer: Joi.ObjectId().required(),
        movie: Joi.ObjectId().required()
    }

    return Joi.validate(data, schema);
}

exports.Rental = Rental;
exports.RentalSchema = Schema;
exports.validate = validate;