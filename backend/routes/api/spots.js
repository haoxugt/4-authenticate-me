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

// optional validator middleware
// (req, res, next) => {
//     if (req.body.state === undefined) {
//         const err = new Error("Bad request.");
//         err.title = "Bad request."
//         err.status = 400;
//         err.errors = { "state": "State is required." };
//         throw err;
//     } else { next(); }
// },

// helper functions
async function getSpotsInfo(spots) {
    for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
        const spot = spots[spotIdx];
        const reviews = await spot.getReviews();
        if (reviews.length) {
            let avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0);
            avgRating /= reviews.length;
            spots[spotIdx].dataValues.avgRating = avgRating;
        } else {
            spots[spotIdx].dataValues.avgRating = null;
        }
        const img = await spot.getSpotImages({ where: { preview: true } });
        if (img.length) {
            const previewImage = img[0].url;
            spots[spotIdx].dataValues.previewImage = previewImage;
        } else {
            spots[spotIdx].dataValues.previewImage = null;
        }
    }
    return spots;
}

async function checkAuthorization(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        if (req.user.id !== spot.ownerId) {
            const err = new Error('Authorization by the owner required');
            err.title = 'Authorization required';
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            return next(err);
        } else {
            next();
        }
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
};

async function getReviewsInfo(reviews, includeSpot) {
    for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const review = reviews[reviewIdx];
        const user = await review.getUser({ attributes: ["id", "firstName", "lastName"] });
        reviews[reviewIdx].dataValues.User = user;

        if (includeSpot) {
            const spot = await review.getSpot({ attributes: { exclude: ["createdAt", "updatedAt"] } });
            const previewImage = await spot.getSpotImages({ attributes: ["url"] });
            spot.dataValues.previewImage = previewImage[0].url
            reviews[reviewIdx].dataValues.Spot = spot;
        }

        const images = await review.getReviewImages({ attributes: ["id", "url"] });
        if (images.length) {
            reviews[reviewIdx].dataValues.ReviewImages = images;
        } else {
            reviews[reviewIdx].dataValues.ReviewImages = null;
        }
    }
    return reviews;
}
async function validateSpotId(req, res, next) {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot){
        next();
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    };
}

// routers

router.get('/', async (req, res) => {

    let spots = await Spot.findAll();
    spots = await getSpotsInfo(spots);
    res.json(spots)
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    let spots = await user.getSpots();
    spots = await getSpotsInfo(spots);
    res.json(spots);
});

router.get('/:spotId/reviews', validateSpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    let reviews = await spot.getReviews();
    if (reviews.length) {
        reviews = await getReviewsInfo(reviews, false);
    } else {
        reviews = "none";
    }
    res.json({ Reviews: reviews });
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

router.post('/:spotId/images', requireAuth, checkAuthorization, async (req, res) => {
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    console.log(spot)
    if (spot) {
        const spotImage = await spot.createSpotImage({
            url, preview
        });
        res.json(spotImage);
    } else {
        const err = new Error("Spot couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        next(err);
    }
});

router.put('/:spotId', requireAuth, checkAuthorization,
    validateSpotInput, async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;
        res.json(spot);
    }
);


router.delete('/:spotId', requireAuth, checkAuthorization, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    res.json({ message: "Successfully deleted" });
})


module.exports = router;
