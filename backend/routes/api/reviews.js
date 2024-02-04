const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User, ReviewImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors, validateReviewImageInput, validateReviewInput } = require('../../utils/validateInput.js');
const { validateReviewId }  = require('../../utils/validateId.js');
const { checkMaxNumOfReviewImages } = require('../../utils/othermiddlewares.js');
const { checkAuthorization } = require('../../utils/authorization.js');

const { formatDate, getReviewsInfo } = require('../../utils/subroutines.js')


// routers

router.get('/', async (req, res) => {

    const reviews = await Review.findAll();
    return res.json({ Reviews: reviews });
});

router.get('/review-images', async (req, res) => {
    const images = await ReviewImage.findAll();
    return res.json(images);
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
    return res.json({ Reviews: reviews });
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
    return res.json(reviewImage);


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
        return res.json(reviewResponse);

    });

// Delete a Review
router.delete('/:reviewId', requireAuth, validateReviewId,
    checkAuthorization, async (req, res) => {
        const review = await Review.findByPk(req.params.reviewId);
        await review.destroy();
        return res.json({ "message": "Successfully deleted" })
    });

module.exports = router;
