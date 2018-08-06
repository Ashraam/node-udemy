const request = require('supertest')
let server;

const { User } = require('../../models/user')
const { Genre } = require('../../models/genre')

describe('Authoriation middleware', () => {
    let token;
    const exec = () => {
        return request(server).post('/api/genres').set('x-auth-token', token).send({name: 'genre1' });
    }

    beforeEach(async () => {
        server = require('../../index')
        token = new User().generateAuthToken();
    })

    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    })

    it('should return 401 if token not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token', async () => {
        token = 'azerty';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 201 if valid token', async () => {
        const res = await exec();

        expect(res.status).toBe(201);
    })
});