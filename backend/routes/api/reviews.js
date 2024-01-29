const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');
// const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    // const reviews = await Review.findByPk(1, {
    //     include: [{model: User}, {model: Spot}]
    // });
    const reviews = await Review.findAll();
    res.json({Reviews: reviews});
});

router.get('/review-images', async (req, res) => {
    // const review = await Review.findByPk(1);
    // await review.destroy()
    const images = await ReviewImage.findAll();
    res.json(images);
});


module.exports = router;
