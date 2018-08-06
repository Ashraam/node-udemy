const express = require('express')
const mongoose = require('mongoose')
const Fawn = require('fawn')
const router = express.Router()


const Customer = require('./../models/customer')
const { Movie } = require('./../models/movie')
const { Rental, validate } = require('./../models/rental')

Fawn.init(mongoose)

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort({dateOut: -1});

    res.json(rentals);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let result = await Promise.all([
        Customer.findById(req.body.customer),
        Movie.findById(req.body.movie)
    ]);

    const [customer, movie] = result;

    if(!customer) return res.status(404).send('Customer not found');
    if(!movie) return res.status(404).send('Movie not found');

    if(movie.numberInStock <= 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {
                _id: movie._id
            }, {
                $inc: { numberInStock: -1 },
            })
            .run();
        
        res.json(rental);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;