// const { Op } = require('sequelize');
const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../db/models');


async function validateSpotId(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        req.userIdToCheck = spot.ownerId;
        return next();
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        return next(err);
    };
};


// Validate review input
async function validateReviewId(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (review) {
        req.userIdToCheck = review.userId;
        return next();
    } else {
        const err = new Error("Review couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        return next(err);
    };
};

async function validateBookingId(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (booking) {
        req.userIdToCheck = booking.userId;
        return next();
    } else {
        const err = new Error("Booking couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        // err.errors = { message: "Booking couldn't be found" };
        return next(err);
    };
};

// check if SpotImage exists
async function validateReviewImageId(req, res, next) {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    if (reviewImage) {
        const review = await Review.findByPk(reviewImage.reviewId);
        req.userIdToCheck = review.userId;
        return next();
    } else {
        const err = new Error("Review Image couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        // err.errors = { message: "Review Image couldn't be found" };
        return next(err);
    };
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
        err.title = "Not Found";
        err.status = 404;
        // err.errors = { message: "Spot Image couldn't be found" };
        return next(err);
    };
};

module.exports = {
    validateSpotId,
    validateReviewId,
    validateBookingId,
    validateReviewImageId,
    validateSpotImageId
};
