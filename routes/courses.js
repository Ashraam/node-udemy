const express = require('express')

const Course = require('../models/course')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ name: 1 });

        // Exo 1
        //const courses = await Course.find({isPublished: true, tags: 'backend'}).sort({name: 1}).select({name: 1, author: 1});

        // Exo 2
        /*const courses = await Course.find({
            isPublished: true,
            tags: {
                $in: ['backend', 'frontend']
            }
        }).sort({ price: -1 }).select({ name: 1, author: 1 });*/

        // Exo 3
        /*const courses = await Course.find({
            isPublished: true
        })
        .or([
            { price: {  $gte: 15 } },
            { name: /^.*by.*$/i }
        ])
        .select({name: 1, author: 1, price: 1, _id:-1});*/

        res.json(courses);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    const course = new Course({
        name: 'test',
        author: 'Romain',
        isPublished: true
    });

    try {
        const result = await course.save();

        res.json(result);
    } catch(e) {
        res.status(400).send(e.errors);
    }
});

module.exports = router;