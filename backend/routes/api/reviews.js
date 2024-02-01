const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User, ReviewImage } = require('../../db/models');
// const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const bcrypt = require('bcryptjs');

// helper functions
async function getReviewsInfo(reviews) {
    for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const review = reviews[reviewIdx];
        const user = await review.getUser({ attributes: ["id", "firstName", "lastName"] });
        reviews[reviewIdx].dataValues.User = user;

        const spot = await review.getSpot({ attributes: { exclude: ["createdAt", "updatedAt"] } });
        const previewImage = await spot.getSpotImages({ attributes: ["url"] });
        if (previewImage.length) {
            spot.dataValues.previewImage = previewImage[0].url
        } else {
            spot.dataValues.previewImage = "none";
        }
        delete spot.dataValues.description;
        reviews[reviewIdx].dataValues.Spot = spot;

        const images = await review.getReviewImages({ attributes: ["id", "url"] });
        if (images.length) {
            reviews[reviewIdx].dataValues.ReviewImages = images;
        } else {
            reviews[reviewIdx].dataValues.ReviewImages = "none";
        }
    }
    return reviews;
}

const validateReviewImageInput = [
    check('url')
        .isString()
        .withMessage('Url must be a string.')
        .notEmpty()
        .withMessage('Review image url is required.'),
    handleValidationErrors
];

const validateReviewInput = [
    check('review')
        .isString()
        .withMessage('Review must be a string.')
        .notEmpty()
        .withMessage('Review text is required.'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5.')
        .notEmpty()
        .withMessage('Stars input is required.'),
    handleValidationErrors
];


// middlewares
// need to be refactored
async function validateReviewId(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (review) {
        next();
    } else {
        const err = new Error("Review couldn't be found");
        err.title = "Bad request";
        err.errors = { message: "Review couldn't be found" };
        err.status = 404;
        next(err);
    }
}

async function checkAuthorization(req, res, next) {
    const review = await Review.findByPk(req.params.reviewId);
    if (req.user.id !== review.userId) {
        const err = new Error('Forbidden. Authorization by the reviewer required');
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
    // const reviews = await Review.findByPk(1, {
    //     include: [{model: User}, {model: Spot}]
    // });
    const reviews = await Review.findAll();
    res.json({ Reviews: reviews });
});

router.get('/review-images', async (req, res) => {
    // const review = await Review.findByPk(1);
    // await review.destroy()
    const images = await ReviewImage.findAll();
    res.json(images);
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let reviews = await user.getReviews();
    if (reviews.length) {
        reviews = await getReviewsInfo(reviews);
    } else {
        reviews = "none";
    }
    res.json({ Reviews: reviews });
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, validateReviewId, checkAuthorization, checkMaxNumOfReviewImages, validateReviewImageInput, async (req, res) => {
    console.log("-----------------here")
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
        // const spotId = reviewToEdit.spotId;
        // let newReview = await Review.bulkCreate([
        //     {
        //        spotId,
        //        userId: req.user.id,
        //        review,
        //        stars
        //     }
        // ], { validate: true });
        await reviewToEdit.save();
        res.json(reviewToEdit);

    });

// Edit a Review
router.delete('/:reviewId', requireAuth, validateReviewId,
    checkAuthorization, async (req, res) => {
        const review = await Review.findByPk(req.params.reviewId);
        await review.destroy();
        res.json({ "message": "Successfully deleted" })
    });

module.exports = router;
