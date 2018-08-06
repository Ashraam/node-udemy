const request = require('supertest')
const mongoose = require('mongoose')
const moment = require('moment')
let server

const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movie')

describe('/api/returns', () => {
    let customerId;
    let movie;
    let movieId;
    let rental;
    let token;
    const exec = () => {
        return request(server).post('/api/returns').send({ customer: customerId, movie: movieId }).set('x-auth-token', token);
    }

    beforeEach(async () => {
        server = require('../../index')
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'Movie',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Romain'
            },
            movie: {
                _id: movieId,
                title: 'Movie',
                dailyRentalRate: 2
            }
        });

        await movie.save();
        await rental.save();
    })

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});

        await server.close();
    });

    it('should return error 401 if client not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return error 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return error 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return error 404 if no rental found with this customerId and MovieId', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return error 400 if rental already processed', async () => {
        rental.dateReturned = Date.now();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return status 200', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the rentalFee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBeDefined();
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock by 1', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'customer', 'movie', 'rentalFee']));
    });
});