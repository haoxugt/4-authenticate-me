const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { User, Booking, Spot } = require('../../db/models');
// const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');


// helper functions
async function getBookingsInfo(bookings) {
    for (let bookingIdx = 0; bookingIdx < bookings.length; bookingIdx++) {
        const booking = bookings[bookingIdx];

        const spot = await booking.getSpot(
            {
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"]
                }
            });
        const img = await spot.getSpotImages({ where: { preview: true } });
        if (img.length) {
            const previewImage = img[0].url;
            spot.dataValues.previewImage = previewImage;
        } else {
            spot.dataValues.previewImage = null;
        }
        bookings[bookingIdx].dataValues.Spot = spot;

    }
    return bookings;
}


router.get('/', async (req, res) => {
    // const user = await User.findByPk(1);
    // await user.destroy();
    const bookings = await Booking.findAll();
    res.json(bookings);
});

router.get('/current', requireAuth, async (req, res) => {
    // const user = await User.findByPk(1);
    // await user.destroy();
    // const bookings = await Booking.findAll();
    const { user } = req;
    let bookings = await user.getBookings();
    // console.log("---------------", bookings[0] instanceof Booking);
    bookings = await getBookingsInfo(bookings);
    res.json({ Bookings: bookings });
});


module.exports = router;
