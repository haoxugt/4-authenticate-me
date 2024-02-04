const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../db/models');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);
        const err = Error("Bad request");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request";
        return next(err);
    }
    return next();

};

// ---------- Validators used in routes/api/users.js ----------
// Validate signup body
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 4 })
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('firstName')
        .isAlpha()
        .withMessage('First Name is required')
        .isString()
        .withMessage('First Name must be a string')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .isAlpha()
        .withMessage('Last Name is required')
        .isString()
        .withMessage('Last Name must be a string')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more')
        .isString()
        .withMessage('Password must be a string'),
    handleValidationErrors
];


// check duplicate user
async function checkDuplicateUser(req, res, next) {
    const { username, email } = req.body;
    const userByUsername = await User.findOne({
        where: { username: username }
    });
    if (userByUsername) {
        const err = new Error('User already exists');
        err.title = 'Duplicate user signup';
        err.errors = { username: "User with that username already exists" };
        err.status = 500;
        return next(err);
    }
    const userByEmail = await User.findOne({
        where: { email: email }
    });
    if (userByEmail) {
        const err = new Error('User already exists');
        err.title = 'Duplicate user signup';
        err.errors = { email: "User with that email already exists" };
        err.status = 500;
        return next(err);
    }
    return next();
};

// ---------- Validators used in routes/api/session.js ----------
// Validate login body
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

// ---------- Validators used in routes/api/spots.js ----------
// Validate Spot input
const validateSpotInput = [
    check('address')
        .isString()
        .withMessage('Address must be a string')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .isString()
        .withMessage('City must be a string')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .isString()
        .withMessage('State must be a string')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90')
        .notEmpty()
        .withMessage('Latitude is required'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180')
        .notEmpty()
        .withMessage('Longitude is required'),
    check('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .isString()
        .withMessage('Description must be a string')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price per day must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    handleValidationErrors
];

// Validate Query paramers from req.body
const validateQueryInput = [
    check('page')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude  is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude  is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];

async function validateSpotId(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        req.userIdToCheck = spot.ownerId;
        return next();
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        return next(err);
    };
};

// check if the user review the spot already
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
        // err.errors = { message: 'User already has a review for this spot' };
        err.status = 500;
        return next(err);
    } else {
        return next();
    }
};

// Validate review input
const validateReviewInput = [
    check('review')
        .isString()
        .withMessage('Review must be a string')
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5')
        .notEmpty()
        .withMessage('Stars input is required'),
    handleValidationErrors
];


// Validate Booking input
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

// Booking conflic check
async function checkBookingConflict(req, res, next) {
    const filteredBookingByStartDate = await Booking.findOne({
        where: {
            spotId: parseInt(req.params.spotId),
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
            spotId: parseInt(req.params.spotId),
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
            spotId: parseInt(req.params.spotId),
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
        return next(err);
    } else {
        return next();
    }

};


// Booking conflic check
async function checkBookingConflictEdit(req, res, next) {
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

// ---------- Validators used in routes/api/reviews.js ----------
// Validate review input
async function validateReviewId(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (review) {
        req.userIdToCheck = review.userId;
        return next();
    } else {
        const err = new Error("Review couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        return next(err);
    };
};

// Check maximum 10 reviews already
async function checkMaxNumOfReviewImages(req, res, next) {
    const imgNum = await ReviewImage.count({ where: { reviewId: req.params.reviewId } });
    if (imgNum < 10) {
        next();
    } else {
        const err = new Error("Maximum number of images for this resource was reached");
        err.title = "Bad request";
        // err.errors = { message: "Maximum number of images for this resource was reached" };
        err.status = 403;
        next(err);
    };
};

const validateReviewImageInput = [
    check('url')
        .isString()
        .withMessage('Url must be a string')
        .notEmpty()
        .withMessage('Review image url is required'),
    handleValidationErrors
];

// ---------- Validators used in routes/api/bookings.js ----------

async function validateBookingId(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (booking) {
        req.userIdToCheck = booking.userId;
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

// ---------- Validators used in routes/api/bookings.js ----------
// check if SpotImage exists
async function validateReviewImageId(req, res, next) {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    if (reviewImage) {
        const review = await Review.findByPk(reviewImage.reviewId);
        req.userIdToCheck = review.userId;
        return next();
    } else {
        const err = new Error("Review Image couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        // err.errors = { message: "Review Image couldn't be found" };
        return next(err);
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
        return next(err);
    } else {
        return next();
    }
};

// ---------- Validators used in routes/api/spot-images.js ----------
// check if SpotImage exists
async function validateSpotImageId(req, res, next) {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if (spotImage) {
        const spot = await Spot.findByPk(spotImage.spotId);
        req.userIdToCheck = spot.ownerId;
        return next();
    } else {
        const err = new Error("Spot Image couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        // err.errors = { message: "Spot Image couldn't be found" };
        return next(err);
    };
};

module.exports = {
    handleValidationErrors,

    validateSignup,
    checkDuplicateUser,

    validateLogin,

    validateSpotInput,
    validateSpotId,
    hasReview,
    validateReviewInput,
    validateBookingInput,
    checkBookingConflict,
    validateQueryInput,

    validateReviewId,
    checkMaxNumOfReviewImages,
    validateReviewImageInput,

    validateBookingId,
    checkOldBooking,
    checkBookingConflictEdit,

    validateReviewImageId,
    checkBookingStart,

    validateSpotImageId

};
