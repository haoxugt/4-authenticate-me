const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { User, Booking, Spot } = require('../../db/models');
// const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateBookingInput = [
    check('startDate')
        .isAfter((new Date()).toString())
        .withMessage('startDate cannot be in the past')
        .custom((value) => { return new Date(value).toString() !== 'Invalid Date' })
        .withMessage('startDate is an invalid date')
        .notEmpty()
        .withMessage('startDate is required'),
    check('endDate')
        .isAfter((new Date()).toString())
        .withMessage('endDate cannot be in the past')
        .custom((value, { req }) => {
            // console.log("-----", value, req.body.startDate, new Date(value), new Date(req.body.startDate))
            if (new Date(req.body.startDate).toString() !== 'Invalid Date')
                return new Date(value) > new Date(req.body.startDate);
            else
                return true;
        })
        .withMessage('endDate cannot be on or before startDate')
        .custom((value) => { return new Date(value).toString() !== 'Invalid Date' })
        .withMessage('endDate is an invalid date')
        .notEmpty()
        .withMessage('endDate is required'),
    handleValidationErrors
];

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

// middlewares
// check booking maker ONLY
async function checkAuthorization(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (req.user.id !== booking.userId) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        next();
    }

};

// Check spot owner or booking maker
async function checkAuthorizationBySpotOwnerOrUser(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    const spot = await Spot.findByPk(booking.spotId);

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        next();
    }
}

async function validateBookingId(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (booking) {
        next();
    } else {
        const err = new Error("Booking couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        // err.errors = { message: "Booking couldn't be found" };
        next(err);
    };
};


// Old booking check
async function checkOldBooking(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (new Date(booking.endDate) < new Date()) {
        const err = new Error("Past bookings can't be modified");
        err.title = "Bad request";
        err.errors = { message: "Past bookings can't be modified" };
        err.status = 403;
        next(err);
    } else {
        next();
    };
};

// Check if booking already started
async function checkBookingStart(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (new Date(booking.startDate) < new Date()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.title = "Bad request";
        err.errors = { message: "Bookings that have been started can't be deleted" };
        err.status = 403;
        next(err);
    } else {
        next();
    }
}

// Booking conflic check
async function checkBookingConflict(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    const filteredBookingByStartDate = await Booking.findOne({
        where: {
            spotId: parseInt(booking.spotId),
            id: {
                [Op.ne]: parseInt(req.params.bookingId)
            },
            startDate: {
                [Op.lte]: req.body.startDate
            },
            endDate: {
                [Op.gte]: req.body.startDate
            }
        }
    });

    const filteredBookingByEndDate = await Booking.findOne({
        where: {
            spotId: parseInt(booking.spotId),
            id: {
                [Op.ne]: parseInt(req.params.bookingId)
            },
            startDate: {
                [Op.lte]: req.body.endDate
            },
            endDate: {
                [Op.gte]: req.body.endDate
            }
        }
    });

    const filteredBookingOverlap = await Booking.findOne({
        where: {
            spotId: parseInt(booking.spotId),
            id: {
                [Op.ne]: parseInt(req.params.bookingId)
            },
            startDate: {
                [Op.gt]: req.body.startDate
            },
            endDate: {
                [Op.lt]: req.body.endDate
            }
        }
    });

    if (filteredBookingByStartDate || filteredBookingByEndDate || filteredBookingOverlap) {
        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.title = "Bad request";
        err.status = 403;
        err.errors = {}
        if (filteredBookingByStartDate) {
            err.errors.startDate = "Start date conflicts with an existing booking";
        }
        if (filteredBookingByEndDate) {
            err.errors.endDate = "End date conflicts with an existing booking";
        }
        if (filteredBookingOverlap) {
            err.errors.bookingConflict = "Dates Surround Existing Booking";
        }
        next(err);
    } else {
        next();
    }

};

// routers
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

// Edit a Booking
router.put('/:bookingId', requireAuth, validateBookingId,
    checkAuthorization, checkOldBooking, validateBookingInput, checkBookingConflict,
    async (req, res) => {
        const { startDate, endDate } = req.body;
        const bookingId = parseInt(req.params.bookingId);
        const bookingToEdit = await Booking.findByPk(bookingId);
        bookingToEdit.startDate = startDate;
        bookingToEdit.endDate = endDate;
        await bookingToEdit.save();
        res.json(bookingToEdit);
    });


// Delete a Booking
router.delete('/:bookingId', requireAuth, validateBookingId,
    checkAuthorizationBySpotOwnerOrUser, checkBookingStart,
    async (req, res) => {
        const booking = await Booking.findByPk(req.params.bookingId);
        await booking.destroy();
        res.json({
            "message": "Successfully deleted"
        });
    })

module.exports = router;
