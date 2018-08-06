const mongoose = require('mongoose');
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

schema.methods.generateAuthToken = function() {
    const user = _.pick(this, ['_id', 'name', 'email', 'isAdmin']);

    const token = jwt.sign(user, config.get('JwtSecret'));

    return token;
}

function validate(data) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    }

    return Joi.validate(data, schema);
}

const User = mongoose.model('User', schema);

exports.User = User;
exports.UserSchema = schema;
exports.validate = validate;