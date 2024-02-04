const { User, Spot, SpotImage, Review, Booking } = require('../db/models');
const { createNewError } = require('./subroutines.js');

async function checkAuthorization(req, res, next) {
    // const spot = await Spot.findByPk(req.params.spotId);

    // when create a booking, check it is not by spot owner
    if (req.method === 'POST' && req.originalUrl.startsWith('/api/spots/')
        && req.originalUrl.endsWith('/bookings')) {
            // console.log("11111111111111111111111", req.method, req.url, req.originalUrl)
        if (req.user.id === req.userIdToCheck) {
            // const err = new Error('Forbidden');
            // err.title = 'Authorization required';
            // // err.errors = { message: 'You cannot book the spot you own.' };
            // err.status = 403;
            const err = createNewError('Forbidden', 'Authorization required', 403);
            return next(err);
        }
    // when delete a booking, check it is by spot owner or booking user
    } else if (req.method === 'DELETE' && req.originalUrl.startsWith('/api/bookings/')
    && req.originalUrl.split('/').length === 4) {
        // console.log("3333333333333333333333333", req.method, req.url, req.originalUrl)
        const booking = await Booking.findByPk(req.params.bookingId);
        const spot = await Spot.findByPk(booking.spotId);
        if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
            const err = createNewError('Forbidden', 'Authorization required', 403);
            return next(err);
        }
    } else {
        if (req.user.id !== req.userIdToCheck) {
            // const err = new Error('Forbidden');
            // err.title = 'Authorization required';
            // // err.errors = { message: 'Forbidden' };
            // err.status = 403;
            const err = createNewError('Forbidden', 'Authorization required', 403);
            return next(err);
        }
    }
    return next();
};

//to be delete
// async function checkAuthorizationByOnwer(req, res, next) {
//     // const spot = await Spot.findByPk(req.params.spotId);

//     if (req.user.id === req.userIdToCheck) {
//         const err = new Error('Forbidden');
//         err.title = 'Authorization required';
//         // err.errors = { message: 'You cannot book the spot you own.' };
//         err.status = 403;
//         return next(err);
//     } else {
//         return next();
//     }
// };


// to be delete
// Check spot owner or booking maker
// async function checkAuthorizationBySpotOwnerOrUser(req, res, next) {
//     const booking = await Booking.findByPk(req.params.bookingId);
//     const spot = await Spot.findByPk(booking.spotId);

//     if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
//         // const err = new Error('Forbidden');
//         // err.title = 'Authorization required';
//         // // err.errors = { message: 'Forbidden' };
//         // err.status = 403;
//         const err = createNewError('Forbidden', 'Authorization required', 403);
//         return next(err);
//     } else {
//         return next();
//     }
// }


module.exports = {
    checkAuthorization
    // checkAuthorizationByOnwer,
    // checkAuthorizationBySpotOwnerOrUser
};
