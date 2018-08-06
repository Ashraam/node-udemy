const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config');

describe('user.generateAuthToken', () => {
    it('should return a valid json webtoken', () => {
        const user = new User({
            name: 'Ash',
            isAdmin: true
        });

        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('JwtSecret'));

        expect(decoded).toMatchObject({
            name: 'Ash',
            isAdmin: true
        });
    });
});