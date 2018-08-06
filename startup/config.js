const config = require('config')

module.exports = function() {
    if (!config.get('JwtSecret')) {
        throw new Error('JwtSecret is not defined');
    }
}