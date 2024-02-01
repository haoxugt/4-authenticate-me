const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Review, ReviewImage } = require('../../db/models');
// const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');

// middlewares
// check if SpotImage exists
async function validateReviewImageId(req, res, next) {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    if (reviewImage) {
        next();
    } else {
        const err = new Error("Review Image couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        // err.errors = { message: "Review Image couldn't be found" };
        next(err);
    };
};

// check Authorization
async function checkAuthorization(req, res, next) {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    const review = await Review.findByPk(reviewImage.reviewId);

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


//router
// Delete a Spot Image
router.delete('/:imageId', requireAuth, validateReviewImageId,
checkAuthorization, async (req, res) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    await reviewImage.destroy();
    res.json({
        "message": "Successfully deleted"
    });
});

module.exports = router;
