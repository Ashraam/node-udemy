const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, cb) {
                setTimeout(() => {
                    const result = v && v.length > 0;
                    cb(result);
                }, 1000);
            },
            message: '1 tag required'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    author: {
        type: String,
        required: true
    },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() {
            return this.isPublished;
        }
    }
});

module.exports = mongoose.model('Course', Schema);