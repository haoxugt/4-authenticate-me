const { User, Spot, SpotImage, Review, Booking } = require('../db/models');

async function checkAuthorization(req, res, next) {
    // const spot = await Spot.findByPk(req.params.spotId);

    if (req.user.id !== req.userIdToCheck) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        return next();
    }
};

async function checkAuthorizationByOnwer(req, res, next) {
    // const spot = await Spot.findByPk(req.params.spotId);

    if (req.user.id === req.userIdToCheck) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'You cannot book the spot you own.' };
        err.status = 403;
        return next(err);
    } else {
        return next();
    }
};

// Check spot owner or booking maker
async function checkAuthorizationBySpotOwnerOrUser(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    const spot = await Spot.findByPk(booking.spotId);

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
        const err = new Error('Forbidden');
        err.title = 'Authorization required';
        // err.errors = { message: 'Forbidden' };
        err.status = 403;
        return next(err);
    } else {
        return next();
    }
}


module.exports = {
    checkAuthorization,
    checkAuthorizationByOnwer,
    checkAuthorizationBySpotOwnerOrUser
 };
