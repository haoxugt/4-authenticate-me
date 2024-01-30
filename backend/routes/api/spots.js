const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { Spot, SpotImage, Review } = require('../../db/models');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    // const spots = await Spot.findByPk(2);
    // const reviews = await spots.getReviews({
    //     attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']]
    // });
    // const previewImage = await spots.getSpotImages({ where: { preview: true } });
    // // res.json(reviews);
    // console.log(reviews);
    // res.json({
    //     ...spots.toJSON(),
    //     avgRating: reviews[0].dataValues.avgRating,
    //     previewImage: previewImage[0].url
    // });
    // const spots = await Spot.findAll({
    //     include: [{model: Review}, {model: SpotImage, where: {preview: true}}]
    // });
    // for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
    //     const spot = spots[spotIdx];
    //     let avgRating = spot.Reviews.reduce((acc, curr) => acc + curr.stars, 0);
    //     avgRating /= spot.Reviews.length;
    //     let previewImage  = spot.SpotImages[0].url;
    //     spots[spotIdx].dataValues.avgRating = avgRating;
    //     spots[spotIdx].dataValues.previewImage = previewImage;
    //     delete spots[spotIdx].dataValues.Reviews;
    //     delete spots[spotIdx].dataValues.SpotImages;
    // }
    const spots = await Spot.findAll();
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
    // console.log(spots[0])
    res.json(spots)
});

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    await spot.destroy();
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
})


module.exports = router;
