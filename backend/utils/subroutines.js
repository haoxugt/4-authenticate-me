// Format createdAt and updatedAt output at UTC timezone
function formatDate(ResObj) {
    ResObj.createdAt = ResObj.createdAt
        .toJSON().substring(0, 19).replace('T', ' ') + ' (UTC)';
    ResObj.updatedAt = ResObj.updatedAt
        .toJSON().substring(0, 19).replace('T', ' ') + ' (UTC)';
    return ResObj;
};

// Get spots information
async function getSpotsInfo(spots) {
    let spotsRes = [];
    for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
        const spot = spots[spotIdx];
        spotsRes.push(spot.toJSON());
        spotsRes[spotIdx] = formatDate(spotsRes[spotIdx]);

        const reviews = await spot.getReviews();
        if (reviews.length) {
            let avgRating = reviews.reduce((acc, curr) => acc + curr.stars, 0);
            avgRating /= reviews.length;
            spotsRes[spotIdx].avgRating = Number(avgRating.toFixed(2));
        } else {
            spotsRes[spotIdx].avgRating = "None";
        }
        const img = await spot.getSpotImages({ where: { preview: true } });
        if (img.length) {
            const previewImage = img[0].url;
            spotsRes[spotIdx].previewImage = previewImage;
        } else {
            spotsRes[spotIdx].previewImage = "None";
        }
    }
    return spotsRes;
};

// Get reviews information
async function getReviewsInfo(reviews, includeSpot) {
    let reviewsRes = [];
    for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const review = reviews[reviewIdx];
        reviewsRes.push(review.toJSON());
        reviewsRes[reviewIdx] = formatDate(reviewsRes[reviewIdx]);

        const user = await review.getUser({ attributes: ["id", "firstName", "lastName"] });
        reviewsRes[reviewIdx].User = user.toJSON();

        if (includeSpot) {
            const spot = await review.getSpot({ attributes: { exclude: ["createdAt", "updatedAt"] } });
            const spotRes = spot.toJSON();
            const previewImage = await spot.getSpotImages({ attributes: ["url"] });
            if (previewImage.length) {
                spotRes.previewImage = previewImage[0].url;
            } else {
                spotRes.previewImage = "None";
            }
            delete spotRes.description;
            reviewsRes[reviewIdx].Spot = spotRes;
        }

        const images = await review.getReviewImages({ attributes: ["id", "url"] });
        if (images.length) {
            reviewsRes[reviewIdx].ReviewImages = images.map((el) => el.toJSON());
        } else {
            reviewsRes[reviewIdx].ReviewImages = "None";
        }
    }
    return reviewsRes;
};

async function getBookingsInfo(bookings) {
    let bookingsRes = [];
    for (let bookingIdx = 0; bookingIdx < bookings.length; bookingIdx++) {
        const booking = bookings[bookingIdx];
        bookingsRes.push(booking.toJSON());
        bookingsRes[bookingIdx] = formatDate(bookingsRes[bookingIdx]);

        const spot = await booking.getSpot(
            {
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"]
                }
            });
        let spotRes = spot.toJSON();
        const img = await spot.getSpotImages({ where: { preview: true } });
        if (img.length) {
            spotRes.previewImage = img[0].url;
        } else {
            spotRes.previewImage = "None";
        }
        bookingsRes[bookingIdx].Spot = spotRes;

    }
    return bookingsRes;
}


module.exports = {
    getSpotsInfo,
    formatDate,
    getReviewsInfo,
    getBookingsInfo
};
