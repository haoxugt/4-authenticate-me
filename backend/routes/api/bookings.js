const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot } = require('../../db/models');
// const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    const bookings = await Booking.unscoped().findAll();
    res.json(bookings);
});


module.exports = router;
