const express = require('express')
const router = express.Router()


const AuthMiddleware = require('../middleware/auth')
const Customer = require('./../models/customer')
const { Movie } = require('./../models/movie')
const { Rental, validate } = require('./../models/rental')

router.post('/', AuthMiddleware, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.lookup(req.body.customer, req.body.movie);

    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('Rental already processed');

    await rental.return();

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    res.json(rental);
});

module.exports = router;