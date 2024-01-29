const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User } = require('../../db/models');
const user = require('../../db/models/user');
// const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    // const reviews = await Review.findByPk(1, {
    //     include: [{model: User}, {model: Spot}]
    // });
    const reviews = await Review.findAll();
    res.json({Reviews: reviews});
});


module.exports = router;
