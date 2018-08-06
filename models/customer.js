const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                const re = /^\d{10}$/;
                return (v === null || re.test(v))
            },
            message: 'Phone number must be composed by 10 digits'
        }
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Customer', schema);