const express = require('express')
const winston = require('winston')


const app = express();

require('./startup/logging')();
require('./startup/validation')();
require('./startup/config')();
require('./startup/database')();

if (app.get('env') === 'production') {
    require('./startup/prod')(app);
}

require('./startup/routes')(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    winston.info(`Server running on port ${PORT}`);
});

module.exports = server;