const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { User, Spot, SpotImage, Review } = require('../../db/models');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const validateSpotInput = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required.'),
    check('city')
        .notEmpty()
        .withMessage('City is required.'),
    check('state')
        .notEmpty()
        .withMessage('State is required.'),
    check('country')
        .notEmpty()
        .withMessage('Country is required.'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90.')
        .notEmpty()
        .withMessage('Latitude is required.'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude  must be within -180 and 180.')
        .notEmpty()
        .withMessage('Longitude is required.'),
    check('name')
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters.'),
    check('description')
        .notEmpty()
        .withMessage('Description is required.'),
    check('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price per day must be a positive number.')
        .notEmpty()
        .withMessage('Price is required.'),
    handleValidationErrors
];

// (req, res, next) => {
//     if (req.body.state === undefined) {
//         const err = new Error("State is required.");
//         err.title = "Bad request."
//         err.status = 400;
//         err.path = "state";
//         throw err;
//     } else { next();}
// },
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

router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: SpotImage, attributes: ["id", "url", "preview"] },
            { model: User, attributes: ["id", "firstName", "lastName"] }
        ]
    });
    if (spot) {
        spot.dataValues.Owner = spot.dataValues.User;
        delete spot.dataValues.User;
        res.json(spot);
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
});

router.post('/', requireAuth, validateSpotInput, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.bulkCreate([
        {
            ownerId: req.user.id,
            address, city, state, country, lat, lng, name, description, price
        }
    ], { validate: true });
    res.status(201).json(spot[0]);
});

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    await spot.destroy();
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
})


module.exports = router;
