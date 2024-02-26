const { Op, where } = require('sequelize');
const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../db/models');
//

async function assembleQueryObj(req, res, next) {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    let queryObj = {
        where: {}
    };
    page = page === undefined ? 1 : parseInt(page);
    size = size === undefined ? 20 : parseInt(size);
    queryObj.limit = size;
    queryObj.offset = size * (page - 1);

    if (minLat !== undefined && maxLat !== undefined) {
        queryObj.where.lat = {
            [Op.gte]: minLat,
            [Op.lte]: maxLat
        }
    } else if (minLat !== undefined) {
        queryObj.where.lat = {
            [Op.gte]: minLat
        }
    } else if (maxLat !== undefined) {
        queryObj.where.lat = {
            [Op.lte]: maxLat
        }
    }

    if (minLng !== undefined && maxLng !== undefined) {
        queryObj.where.lng = {
            [Op.gte]: minLng,
            [Op.lte]: maxLng
        }
    } else if (minLng !== undefined) {
        queryObj.where.lng = {
            [Op.gte]: minLng
        }
    } else if (maxLng !== undefined) {
        queryObj.where.lng = {
            [Op.lte]: maxLng
        }
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
        queryObj.where.price = {
            [Op.gte]: minPrice,
            [Op.lte]: maxPrice
        }
    } else if (minPrice !== undefined) {
        queryObj.where.price = {
            [Op.gte]: minPrice
        }
    } else if (maxPrice !== undefined) {
        queryObj.where.price = {
            [Op.lte]: maxPrice
        }
    }
    req.queryObj = queryObj;
    req.queryParams = { page, size }
    return next();
};

// check duplicate user
async function checkDuplicateUser(req, res, next) {
    const { username, email } = req.body;
    const userByUsername = await User.findOne({
        where: { username: username }
    });
    if (userByUsername) {
        const err = new Error('User already exists');
        err.title = 'Server Error';
        err.errors = { username: "Username must be unique" };
        err.status = 500;
        return next(err);
    }
    const userByEmail = await User.findOne({
        where: { email: email }
    });
    if (userByEmail) {
        const err = new Error('User already exists');
        err.title = 'Server Error';
        err.errors = { email: "Email must be unique" };
        err.status = 500;
        return next(err);
    }
    return next();
};

// check if the user review the spot already
async function hasReview(req, res, next) {
    const review = await Review.findOne({
        where: {
            spotId: parseInt(req.params.spotId),
            userId: req.user.id
        }
    });
    if (review) {
        const err = new Error("User already has a review for this spot");
        err.title = "Server Error";
        // err.errors = { message: 'User already has a review for this spot' };
        err.status = 500;
        return next(err);
    } else {
        return next();
    }
};

// Booking conflic check
async function checkBookingConflict(req, res, next) {
    const where = {
        startDate: {},
        endDate: {}
    };
    if (req.method === 'PUT' && req.originalUrl.startsWith('/api/bookings/')) {
        const booking = await Booking.findByPk(req.params.bookingId);
        where.spotId = parseInt(booking.spotId);
        where.id = { [Op.ne]: parseInt(req.params.bookingId) };
    } else if (req.method === 'POST' && req.originalUrl.startsWith('/api/spots/')) {
        where.spotId = parseInt(req.params.spotId);
    }

    where.startDate = { [Op.lte]: req.body.startDate };
    where.endDate = { [Op.gte]: req.body.startDate };
    const filteredBookingByStartDate = await Booking.findOne({ where });

    where.startDate = { [Op.lte]: req.body.endDate };
    where.endDate = { [Op.gte]: req.body.endDate };
    const filteredBookingByEndDate = await Booking.findOne({ where });

    where.startDate = { [Op.gt]: req.body.startDate };
    where.endDate = { [Op.lt]: req.body.endDate };
    const filteredBookingOverlap = await Booking.findOne({ where });

    if (filteredBookingByStartDate || filteredBookingByEndDate || filteredBookingOverlap) {
        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.title = "Forbidden";
        err.status = 403;
        err.errors = {}
        if (filteredBookingByStartDate) {
            err.errors.startDate = "Start date conflicts with an existing booking";
        }
        if (filteredBookingByEndDate) {
            err.errors.endDate = "End date conflicts with an existing booking";
        }
        if (filteredBookingOverlap) {
            err.errors.bookingConflict = "Dates Surround Existing Booking";
        }
        return next(err);
    } else {
        return next();
    }

};


// Booking conflic check
// async function checkBookingConflictEdit(req, res, next) {
//     const booking = await Booking.findByPk(req.params.bookingId);
//     const filteredBookingByStartDate = await Booking.findOne({
//         where: {
//             spotId: parseInt(booking.spotId),
//             id: {
//                 [Op.ne]: parseInt(req.params.bookingId)
//             },
//             startDate: {
//                 [Op.lte]: req.body.startDate
//             },
//             endDate: {
//                 [Op.gte]: req.body.startDate
//             }
//         }
//     });

//     const filteredBookingByEndDate = await Booking.findOne({
//         where: {
//             spotId: parseInt(booking.spotId),
//             id: {
//                 [Op.ne]: parseInt(req.params.bookingId)
//             },
//             startDate: {
//                 [Op.lte]: req.body.endDate
//             },
//             endDate: {
//                 [Op.gte]: req.body.endDate
//             }
//         }
//     });

//     const filteredBookingOverlap = await Booking.findOne({
//         where: {
//             spotId: parseInt(booking.spotId),
//             id: {
//                 [Op.ne]: parseInt(req.params.bookingId)
//             },
//             startDate: {
//                 [Op.gt]: req.body.startDate
//             },
//             endDate: {
//                 [Op.lt]: req.body.endDate
//             }
//         }
//     });

//     if (filteredBookingByStartDate || filteredBookingByEndDate || filteredBookingOverlap) {
//         const err = new Error("Sorry, this spot is already booked for the specified dates");
//         err.title = "Forbidden";
//         err.status = 403;
//         err.errors = {}
//         if (filteredBookingByStartDate) {
//             err.errors.startDate = "Start date conflicts with an existing booking";
//         }
//         if (filteredBookingByEndDate) {
//             err.errors.endDate = "End date conflicts with an existing booking";
//         }
//         if (filteredBookingOverlap) {
//             err.errors.bookingConflict = "Dates Surround Existing Booking";
//         }
//         return next(err);
//     } else {
//         return next();
//     }

// };

// Old booking check
async function checkOldBooking(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (new Date(booking.endDate) < new Date()) {
        const err = new Error("Past bookings can't be modified");
        err.title = "Forbidden";
        // err.errors = { message: "Past bookings can't be modified" };
        err.status = 403;
        return next(err);
    } else {
        return next();
    };
};

// Check if booking already started
async function checkBookingStart(req, res, next) {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (new Date(booking.startDate) < new Date()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.title = "Forbidden";
        // err.errors = { message: "Bookings that have been started can't be deleted" };
        err.status = 403;
        return next(err);
    } else {
        return next();
    }
};

// Check maximum 10 reviews already
async function checkMaxNumOfReviewImages(req, res, next) {
    const imgNum = await ReviewImage.count({ where: { reviewId: req.params.reviewId } });
    if (imgNum < 10) {
        return next();
    } else {
        const err = new Error("Maximum number of images for this resource was reached");
        err.title = "Forbidden";
        // err.errors = { message: "Maximum number of images for this resource was reached" };
        err.status = 403;
        return next(err);
    };
};


module.exports = {
    assembleQueryObj,
    checkDuplicateUser,
    hasReview,
    checkBookingConflict,
    // checkBookingConflictEdit,
    checkOldBooking,
    checkBookingStart,
    checkMaxNumOfReviewImages

};
