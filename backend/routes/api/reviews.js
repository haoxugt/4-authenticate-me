const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User, ReviewImage } = require('../../db/models');
// const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { formatDate, getReviewsInfo } = require('../../utils/subroutines.js')
// const bcrypt = require('bcryptjs');

// helper functions

const validateReviewImageInput = [
    check('url')
        .isString()
        .withMessage('Url must be a string')
        .notEmpty()
        .withMessage('Review image url is required'),
    handleValidationErrors
];

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


// middlewares

async function checkAuthorization(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (req.user.id !== review.userId) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        next();
    }

};

async function validateReviewId(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (review) {
        next();
    } else {
        const err = new Error("Review couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    };
};

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


// routers

router.get('/', async (req, res) => {

    const reviews = await Review.findAll();
    res.json({ Reviews: reviews });
});

router.get('/review-images', async (req, res) => {
    const images = await ReviewImage.findAll();
    res.json(images);
});


// Get reviews of current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let reviews = await user.getReviews();
    if (reviews.length) {
        reviews = await getReviewsInfo(reviews, true);
    } else {
        reviews = "None";
    }
    res.json({ Reviews: reviews });
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, validateReviewId, checkAuthorization, checkMaxNumOfReviewImages, validateReviewImageInput, async (req, res) => {
    const { url } = req.body;
    const reviewId = parseInt(req.params.reviewId);
    const newImg = await ReviewImage.bulkCreate([
        {
            reviewId,
            url
        }
    ], { validate: true });
    const reviewImage = {
        id: newImg[0].id,
        url: newImg[0].url
    }
    res.json(reviewImage);


});

// Edit a Review
router.put('/:reviewId', requireAuth, validateReviewId,
    checkAuthorization, validateReviewInput,
    async (req, res) => {
        const { review, stars } = req.body;
        let reviewToEdit = await Review.findByPk(req.params.reviewId);
        reviewToEdit.review = review;
        reviewToEdit.stars = stars;

        await reviewToEdit.save();
        let reviewResponse = reviewToEdit.toJSON();
        reviewResponse = formatDate(reviewResponse);
        res.json(reviewResponse);

    });

// Edit a Review
router.delete('/:reviewId', requireAuth, validateReviewId,
    checkAuthorization, async (req, res) => {
        const review = await Review.findByPk(req.params.reviewId);
        await review.destroy();
        res.json({ "message": "Successfully deleted" })
    });

module.exports = router;
