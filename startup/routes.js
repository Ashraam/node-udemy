const bodyParser = require('body-parser')
const morgan = require('morgan')
const debug = require('debug')('app:dev')

const errorMiddleware = require('../middleware/error')

const genres = require('../routes/genres')
const courses = require('../routes/courses')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
const returns = require('../routes/returns')
const users = require('../routes/users')
const auth = require('../routes/auth')

module.exports = function(app) {
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debug('morgan started');
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/genres', genres);
    app.use('/api/courses', courses);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns)
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(errorMiddleware)
}