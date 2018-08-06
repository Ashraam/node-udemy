const debug = require('debug')('app:dev')
const config = require('config')
const mongoose = require('mongoose')

const db = config.get('db_host');

module.exports = function() {
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => debug(`connected to MongoDB: ${db}`));
}