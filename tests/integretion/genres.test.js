const request = require('supertest')
const mongoose = require('mongoose')
let server

const { User } = require('../../models/user')
const { Genre } = require('../../models/genre')

const route = '/api/genres'

describe('/api/genres', () => {
    beforeEach(async () => {
        server = require('../../index')
    })

    afterEach(async () => {
        await Genre.remove({});

        await server.close();
    })


    /**
     * GET /
     */
    /*describe('GET /', () => {
        it('should return all genres', async () => {
            const genres = [
                { name: 'Action' },
                { name: 'Aventure' },
                { name: 'Comedie' }
            ];

            await Genre.collection.insertMany(genres);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'Action')).toBeTruthy();
        });
    });


    /**
     * GET /:id
     */
    describe('GET /:id', () => {
        it('should return a specific genre', async () => {
            const genre = new Genre({ name: 'Action' });
            await genre.save();

            const res = await request(server).get(`${route}/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return a 404 error if invalid ObjectId', async () => {
            const res = await request(server).get(`${route}/1`);

            expect(res.status).toBe(404);
        });

        it('should return a 404 error if the genre does not exists', async () => {
            const res = await request(server).get(`${route}/${mongoose.Types.ObjectId()}`);

            expect(res.status).toBe(404);
        });
    });


    /**
     * PUT /:id
     */
    describe('PUT /:id', () => {
        let token;
        let name;
        let genre;

        const exec = () => {
            return request(server).put(`${route}/${genre._id}`).send({ name }).set('x-auth-token', token);
        }

        beforeEach(async () => {
            token = new User({ name: 'a' }).generateAuthToken();
            genre = new Genre({ name: 'Action' });
            await genre.save();
        });

        it('should return a 400 error if invalid input', async () => {
            name = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return the name after update', async () => {
            name = 'Aventure'

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({name});
        });
    });


    /**
     * POST /
     */
    describe('POST /', () => {
        let token;
        let name;

        const exec = () => {
            return request(server).post(`${route}`).send({ name }).set('x-auth-token', token);
        }

        beforeEach(() => {
            token = new User({ name: 'a' }).generateAuthToken();
            name = 'azerty'
        });

        it('should return status 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return status 400 if empty name input', async () => {
            name = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return status 400 if input less than 3 car', async () => {
            name = 'a';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return status 201 and an object with the same name', async () => {
            const res = await exec();

            const genre = await Genre.find({ name });

            expect(res.status).toBe(201);
            expect(genre).not.toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'azerty'); 
        });
    });
});