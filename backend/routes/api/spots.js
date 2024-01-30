const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { Spot, SpotImage, Review } = require('../../db/models');
const bcrypt = require('bcryptjs');

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

router.get('/current', async (req, res, next) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        let spots = await user.getSpots();
        spots = await getSpots(spots);
        return res.json(spots);
    } else {
        // return res.status(400).json({ "message": "Need log in" });
        const err = new Error("Need log in")
        err.status = 401;
        next(err);
    }


});

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    await spot.destroy();
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
})


module.exports = router;
