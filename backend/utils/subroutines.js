function formatDate(ResObj) {
    ResObj.createdAt = ResObj.createdAt
        .toJSON().substring(0, 19).replace('T', ' ') + ' (UTC)';
    ResObj.updatedAt = ResObj.updatedAt
        .toJSON().substring(0, 19).replace('T', ' ') + ' (UTC)';
    return ResObj;
}

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
    formatDate,
    getReviewsInfo,
    getBookingsInfo
};
