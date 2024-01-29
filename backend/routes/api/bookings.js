const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { User, Booking, Spot } = require('../../db/models');
// const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    // const user = await User.findByPk(1);
    // await user.destroy();
    const bookings = await Booking.findAll();
    res.json(bookings);
});


module.exports = router;
