const express = require('express')
const router = express.Router();
const sequelize = require('sequelize');

const { Op } = require('sequelize');
const { User, Spot, SpotImage, Review, Booking } = require('../../db/models');
const bcrypt = require('bcryptjs');

const { check, body } = require('express-validator');
const { handleValidationErrors, validateSpotInput, validateReviewInput,
    validateBookingInput,validateQueryInput } = require('../../utils/validateInput.js');
const { validateSpotId } = require('../../utils/validateId.js');
const { hasReview, checkBookingConflict }  = require('../../utils/othermiddlewares.js');
const { requireAuth } = require('../../utils/auth');
const { checkAuthorization } = require('../../utils/authorization.js');
const { formatDate, getSpotsInfo, getReviewsInfo } = require('../../utils/subroutines.js');
const { assembleQueryObj } = require('../../utils/othermiddlewares.js')


// routers
// Get all spots
router.get('/', validateQueryInput, assembleQueryObj, async (req, res) => {

    let spots = await Spot.findAll(req.queryObj);
    spots = await getSpotsInfo(spots);

    return res.json({
        Spots: spots,
        page: req.queryParams.page,
        size: req.queryParams.size
    });
});

//Get spots of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    let spots = await user.getSpots();

    // let spots2 = await Spot.findAll({ where: { ownerId: req.user.id } });

    spots = await getSpotsInfo(spots);
    if (spots.length === 0) spots = "None";
    return res.json({ Spots: spots });
});

// Get reviews on a spot
router.get('/:spotId/reviews', validateSpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    let reviews = await spot.getReviews();
    if (reviews.length) {
        reviews = await getReviewsInfo(reviews, false);
    } else {
        reviews = "None";
    }
    return res.json({ Reviews: reviews });
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, validateSpotId, async (req, res) => {
    const filter = {};
    const spot = await Spot.findByPk(req.params.spotId);
    let bookingsResponse = [];

    // check if the owner of the spot
    if (req.user.id !== spot.ownerId) {
        filter.attributes = ["spotId", "startDate", "endDate"]
    } else {
        filter.include = { model: User, attributes: ["id", "firstName", "lastName"] }
    }
    const bookings = await Booking.findAll({
        where: { spotId: parseInt(req.params.spotId) },
        order: [['id']],
        ...filter
    });

    if (req.user.id !== spot.ownerId) {
        bookingsResponse = bookings.map((el) => el.toJSON());
    } else {
        bookingsResponse = bookings.map((el) => formatDate(el.toJSON()));
    }

    return res.json({ Bookings: bookingsResponse });
});

// Get details of a Spot from an id
router.get('/:spotId', validateSpotId, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: SpotImage, attributes: ["id", "url", "preview"] },
            { model: User, attributes: ["id", "firstName", "lastName"] }
        ]
    });

    let spotResponse = spot.toJSON();

    if (spotResponse.SpotImages.length === 0) {
        spotResponse.SpotImages = null;
    }
    spotResponse.Owner = spotResponse.User;
    delete spotResponse.User;

    // get reviews
    const spotReviews = await spot.getReviews();

    spotResponse = formatDate(spotResponse);

    spotResponse.numReviews = spotReviews.length;

    if (spotReviews.length) {
        const avgStarRating = spotReviews.reduce((acc, curr) => acc + curr.stars, 0) / spotReviews.length;
        spotResponse.avgStarRating = Number(avgStarRating.toFixed(2));
    } else {
        spotResponse.avgStarRating = "None";
    }
    return res.json(spotResponse);

});


// Create a spot
router.post('/', requireAuth, validateSpotInput, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.bulkCreate([
        {
            ownerId: req.user.id,
            address, city, state, country, lat, lng, name, description, price
        }
    ], { validate: true });

    let spotResponse = spot[0].toJSON();
    spotResponse = formatDate(spotResponse);
    return res.status(201).json(spotResponse);
});


// Create a review based on a spot
router.post('/:spotId/reviews', requireAuth, validateSpotId, hasReview, validateReviewInput, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    let newReview = await Review.bulkCreate([
        {
            spotId,
            userId: req.user.id,
            review,
            stars
        }
    ], { validate: true });

    let reviewResponse = newReview[0].toJSON();
    reviewResponse = formatDate(reviewResponse);

    return res.status(201).json(reviewResponse);
});

// Create a spot image based on a spot Id
router.post('/:spotId/images', requireAuth, validateSpotId, checkAuthorization, async (req, res) => {
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    const spotImage = await spot.createSpotImage({
        url, preview
    });

    return res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });

});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateSpotId,
    validateBookingInput, checkBookingConflict, checkAuthorization,
    async (req, res, next) => {

        const { startDate, endDate } = req.body;
        const spotId = parseInt(req.params.spotId);

        const newBooking = await Booking.bulkCreate([{
            spotId,
            userId: req.user.id,
            startDate,
            endDate
        }], { validate: true });

        let bookingResponse = newBooking[0].toJSON();
        bookingResponse = formatDate(bookingResponse);
        return res.json(bookingResponse);
    });


// Edit a Spot
router.put('/:spotId', requireAuth, validateSpotId, checkAuthorization,
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
        await spot.save();
        let spotResponse = spot.toJSON();
        spotResponse = formatDate(spotResponse);
        return res.json(spotResponse);
    }
);

// Delete a Spot
router.delete('/:spotId', requireAuth, validateSpotId, checkAuthorization, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
})


module.exports = router;
