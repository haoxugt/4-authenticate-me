const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { User, Spot, SpotImage, Review, Booking } = require('../../db/models');
const bcrypt = require('bcryptjs');

const { check, body } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const validateSpotInput = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required.'),
    check('city')
        .notEmpty()
        .withMessage('City is required.'),
    check('state')
        .notEmpty()
        .withMessage('State is required.'),
    check('country')
        .notEmpty()
        .withMessage('Country is required.'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90.')
        .notEmpty()
        .withMessage('Latitude is required.'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude  must be within -180 and 180.')
        .notEmpty()
        .withMessage('Longitude is required.'),
    check('name')
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters.'),
    check('description')
        .notEmpty()
        .withMessage('Description is required.'),
    check('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price per day must be a positive number.')
        .notEmpty()
        .withMessage('Price is required.'),
    handleValidationErrors
];

const validateReviewInput = [
    check('review')
        .notEmpty()
        .withMessage('Review text is required.'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5.')
        .notEmpty()
        .withMessage('Stars input is required.'),
    handleValidationErrors
];

const validateBookingInput = [
    check('startDate')
        .isAfter((new Date()).toString())
        .withMessage('startDate cannot be in the past.')
        .custom((value) => { return new Date(value).toString() !== 'Invalid Date' })
        .withMessage('startDate is an invalid date.')
        .notEmpty()
        .withMessage('startDate is required.'),
    check('endDate')
        .custom((value, { req }) => {
            // console.log("-----", value, req.body.startDate, new Date(value), new Date(req.body.startDate))
            if (new Date(req.body.startDate).toString() !== 'Invalid Date')
                return new Date(value) > new Date(req.body.startDate);
            else
                return true;
        })
        .withMessage('endDate cannot be on or before startDate.')
        .custom((value) => { return new Date(value).toString() !== 'Invalid Date' })
        .withMessage('endDate is an invalid date.')
        .notEmpty()
        .withMessage('endDate is required.'),
    handleValidationErrors
];

// optional validator middleware
// (req, res, next) => {
//     if (req.body.state === undefined) {
//         const err = new Error("Bad request.");
//         err.title = "Bad request."
//         err.status = 400;
//         err.errors = { "state": "State is required." };
//         throw err;
//     } else { next(); }
// },

// helper functions
async function getSpotsInfo(spots) {
    for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
        const spot = spots[spotIdx];
        const reviews = await spot.getReviews();
        if (reviews.length) {
            let avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0);
            avgRating /= reviews.length;
            spots[spotIdx].dataValues.avgRating = avgRating;
        } else {
            spots[spotIdx].dataValues.avgRating = null;
        }
        const img = await spot.getSpotImages({ where: { preview: true } });
        if (img.length) {
            const previewImage = img[0].url;
            spots[spotIdx].dataValues.previewImage = previewImage;
        } else {
            spots[spotIdx].dataValues.previewImage = null;
        }
    }
    return spots;
}


async function getReviewsInfo(reviews, includeSpot) {
    for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const review = reviews[reviewIdx];
        const user = await review.getUser({ attributes: ["id", "firstName", "lastName"] });
        reviews[reviewIdx].dataValues.User = user;

        if (includeSpot) {
            const spot = await review.getSpot({ attributes: { exclude: ["createdAt", "updatedAt"] } });
            const previewImage = await spot.getSpotImages({ attributes: ["url"] });
            spot.dataValues.previewImage = previewImage[0].url
            reviews[reviewIdx].dataValues.Spot = spot;
        }

        const images = await review.getReviewImages({ attributes: ["id", "url"] });
        if (images.length) {
            reviews[reviewIdx].dataValues.ReviewImages = images;
        } else {
            reviews[reviewIdx].dataValues.ReviewImages = null;
        }
    }
    return reviews;
};

// middlewares
async function checkAuthorization(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        if (req.user.id !== spot.ownerId) {
            const err = new Error('Authorization by the owner required');
            err.title = 'Authorization required';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        } else {
            next();
        }
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
};

async function validateSpotId(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        next();
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    };
};

async function hasReview(req, res, next) {
    const review = await Review.findOne({
        where: {
            spotId: parseInt(req.params.spotId),
            userId: req.user.id
        }
    });
    if (review) {
        const err = new Error("User already has a review for this spot");
        err.title = "Bad request";
        err.errors = { message: 'User already has a review for this spot' };
        err.status = 500;
        next(err);
    } else {
        next();
    }
};

// Booking conflic check
async function checkBookingConflict(req, res, next) {
    const filteredBookingByStartDate = await Booking.findOne({
        where: {
            startDate: {
                [Op.lte]: req.body.startDate
            },
            endDate: {
                [Op.gt]: req.body.startDate
            }
        }
    });

    const filteredBookingByEndDate = await Booking.findOne({
        where: {
            startDate: {
                [Op.lt]: req.body.endDate
            },
            endDate: {
                [Op.gte]: req.body.endDate
            }
        }
    });

    const filteredBookingOverlap = await Booking.findOne({
        where: {
            startDate: {
                [Op.gte]: req.body.startDate
            },
            endDate: {
                [Op.lte]: req.body.endDate
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
            err.errors.bookingConflict = "Part of your stay has already been booked.";
        }
        next(err);
    } else {
        next();
    }

};

// routers

router.get('/', async (req, res) => {

    let spots = await Spot.findAll();
    spots = await getSpotsInfo(spots);
    res.json(spots)
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    let spots = await user.getSpots();
    spots = await getSpotsInfo(spots);
    res.json(spots);
});

router.get('/:spotId/reviews', validateSpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    let reviews = await spot.getReviews();
    if (reviews.length) {
        reviews = await getReviewsInfo(reviews, false);
    } else {
        reviews = "none";
    }
    res.json({ Reviews: reviews });
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, validateSpotId, async (req, res) => {
    const filter = {};
    const spot = await Spot.findByPk(req.params.spotId);

    // check if the owner of the spot
    if (req.user.id !== spot.ownerId) {
        filter.attributes = ["spotId", "startDate", "endDate"]
    } else {
        filter.include = { model: User, attributes: ["id", "firstName", "lastName"] }
    }
    const bookings = await Booking.findAll({
        where: { spotId: parseInt(req.params.spotId) },
        ...filter
    });
    res.json({ Bookings: bookings });
});

router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: SpotImage, attributes: ["id", "url", "preview"] },
            { model: User, attributes: ["id", "firstName", "lastName"] }
        ]
    });
    if (spot) {
        spot.dataValues.Owner = spot.dataValues.User;
        delete spot.dataValues.User;
        res.json(spot);
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
});



router.post('/', requireAuth, validateSpotInput, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.bulkCreate([
        {
            ownerId: req.user.id,
            address, city, state, country, lat, lng, name, description, price
        }
    ], { validate: true });
    res.status(201).json(spot[0]);
});

router.post('/:spotId/reviews', requireAuth, validateSpotId, hasReview, validateReviewInput, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    let newReview = await Review.bulkCreate([
        {
            spotId,
            userId: req.user.id,
            review,
            stars
        }
    ], { validate: true });

    res.status(201).json(newReview);
});

router.post('/:spotId/images', requireAuth, checkAuthorization, async (req, res) => {
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    console.log(spot)
    if (spot) {
        const spotImage = await spot.createSpotImage({
            url, preview
        });
        res.json(spotImage);
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateSpotId,
    validateBookingInput, checkBookingConflict, async (req, res, next) => {

        const { startDate, endDate } = req.body;
        const spotId = parseInt(req.params.spotId);
        const spot = await Spot.findByPk(spotId);
        const ownerId = spot.ownerId;
        if (req.user.id === ownerId) {
            const err = new Error("You cannot book the spot you own.");
            err.title = "Bad request";
            err.errors = { message: "You cannot book the spot you own." };
            err.status = 403;
            next(err);
        } else {
            const newBooking = await Booking.bulkCreate([{
                spotId,
                userId: req.user.id,
                startDate,
                endDate
            }], { validate: true });
            res.json(newBooking[0]);
        }

    });

router.put('/:spotId', requireAuth, checkAuthorization,
    validateSpotInput, async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;
        res.json(spot);
    }
);


router.delete('/:spotId', requireAuth, checkAuthorization, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    res.json({ message: "Successfully deleted" });
})


module.exports = router;
