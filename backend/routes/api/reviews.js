const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Booking, Spot, Review, User, ReviewImage } = require('../../db/models');
// const user = require('../../db/models/user');
const { requireAuth } = require('../../utils/auth');
// const bcrypt = require('bcryptjs');

// helper functions
async function getReviewsInfo(reviews) {
    for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const review = reviews[reviewIdx];
        const user = await review.getUser({attributes: ["id", "firstName", "lastName"] });
        reviews[reviewIdx].dataValues.User = user;

        const spot = await review.getSpot({attributes: {exclude: ["createdAt", "updatedAt"]} });
        const previewImage = await spot.getSpotImages({ attributes: ["url"]});
        spot.dataValues.previewImage = previewImage[0].url
        reviews[reviewIdx].dataValues.Spot = spot;

        const images = await review.getReviewImages({attributes: ["id", "url"] });
        if (images.length) {
            reviews[reviewIdx].dataValues.ReviewImages = images;
        } else {
            reviews[reviewIdx].dataValues.ReviewImages = null;
        }
    }
    return reviews;
}

router.get('/', async (req, res) => {
    // const reviews = await Review.findByPk(1, {
    //     include: [{model: User}, {model: Spot}]
    // });
    const reviews = await Review.findAll();
    res.json({Reviews: reviews});
});

router.get('/review-images', async (req, res) => {
    // const review = await Review.findByPk(1);
    // await review.destroy()
    const images = await ReviewImage.findAll();
    res.json(images);
});

router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;
    let reviews = await user.getReviews();
    reviews = await getReviewsInfo(reviews);
    res.json({Reviews: reviews});
});


module.exports = router;
