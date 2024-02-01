const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Spot, SpotImage } = require('../../db/models');
// const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');

// middlewares
// check if SpotImage exists
async function validateSpotImageId(req, res, next) {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if (spotImage) {
        next();
    } else {
        const err = new Error("Review Image couldn't be found");
        err.title = "Bad request";
        err.status = 404;
        err.errors = { message: "Review Image couldn't be found" };
        next(err);
    };
};

// check Authorization
async function checkAuthorization(req, res, next) {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    const spot = await Spot.findByPk(spotImage.spotId);

    if (req.user.id !== spot.ownerId) {
        const err = new Error('Authorization by the spot owner required');
        err.title = 'Authorization required';
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        next();
    }

};

router.get('/', async (req, res) => {
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
});

// Delete a Spot Image
router.delete('/:imageId', requireAuth, validateSpotImageId,
checkAuthorization, async (req, res) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    await spotImage.destroy();
    res.json({
        "message": "Successfully deleted"
    });
});


module.exports = router;
