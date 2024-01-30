const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { Spot, SpotImage, Review } = require('../../db/models');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');

async function getSpots(spots) {
    for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
        const spot = spots[spotIdx];
        const reviews = await spot.getReviews();
        let avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0);
        avgRating /= reviews.length;
        const img = await spot.getSpotImages({ where: { preview: true } });
        const previewImage = img[0].url;
        spots[spotIdx].dataValues.avgRating = avgRating;
        spots[spotIdx].dataValues.previewImage = previewImage;
    }
    return spots;

}

router.get('/', async (req, res) => {

    let spots = await Spot.findAll();
    spots = await getSpots(spots);
    res.json(spots)
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    let spots = await user.getSpots();
    spots = await getSpots(spots);
    res.json(spots);

});

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    await spot.destroy();
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
})


module.exports = router;
