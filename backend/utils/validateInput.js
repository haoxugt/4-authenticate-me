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
        .withMessage('The provided email is invalid'),
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


const validateReviewImageInput = [
    check('url')
        .isString()
        .withMessage('Url must be a string')
        .notEmpty()
        .withMessage('Review image url is required'),
    handleValidationErrors
];


module.exports = {
    handleValidationErrors,

    validateSignup,
    validateLogin,
    validateSpotInput,
    validateReviewInput,
    validateBookingInput,
    validateQueryInput,
    validateReviewImageInput

};
