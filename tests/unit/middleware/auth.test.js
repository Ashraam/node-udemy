const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');

describe('Auth middleware', () => {
    it('should populate req.user with the payload of a valid web token', () => {
        const token = new User({name: 'Romain'}).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user.name).toBe('Romain')
    })
});