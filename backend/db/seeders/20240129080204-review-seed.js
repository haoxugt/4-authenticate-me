'use strict';

const { Op } = require('sequelize');
const { User, Spot, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotReviews = [
  {
    spotName: "Downton Abbey",
    reviews: [
      {
        username: "MatthewCrawley",
        review: "This is a fantastic place!",
        stars: 5,
        createdAt: '2022-02-20'
      },
      {
        username: "HenryTalbot",
        review: "This is an awesome spot!",
        stars: 4,
        createdAt: '2023-02-20'
      }
    ]
  },
  {
    spotName: "Brancaster Castle",
    reviews: [
      {
        username: "RobertCrawley",
        review: "This is a good place!",
        stars: 5,
        createdAt: '2022-03-20'
      },
      {
        username: "CoraCrawley",
        review: "Delighted experience.",
        stars: 5,
        createdAt: '2023-03-20'
      }
    ]
  },
  {
    spotName: "Crawley's House",
    reviews: [
      {
        username: "MaryCrawley",
        review: "Fair good.",
        stars: 3,
        createdAt: '2022-04-20'
      },
      {
        username: "MatthewCrawley",
        review: "Good memory here.",
        stars: 4,
        createdAt: '2023-04-20'
      }
    ]
  },
  {
    spotName: "Grantham's House",
    reviews: [
      {
        username: "MatthewCrawley",
        review: "Nice stay here.",
        stars: 4,
        createdAt: '2022-05-20'
      },
      {
        username: "EdithPelham",
        review: "Very nice.",
        stars: 4,
        createdAt: '2023-05-20'
      }
    ]
  },
  {
    spotName: "Levinson's House",
    reviews: [
      {
        username: "HenryTalbot",
        review: "Want to have a try.",
        stars: 3,
        createdAt: '2022-06-20'
      }
    ]
  },
  {
    spotName: "Downton Abbey",
    reviews: [
      {
        username: "CoraCrawley",
        review: "Like home!",
        stars: 5,
        createdAt: '2024-02-20'
      }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let spotIdx = 0; spotIdx < spotReviews.length; spotIdx++) {
      const { spotName, reviews } = spotReviews[spotIdx];
      const spot = await Spot.findOne({ where: { name: spotName } });
      for (let reviewIdx = 0; reviewIdx < reviews.length; reviewIdx++) {
        const { username, review, stars, createdAt } = reviews[reviewIdx];
        const user = await User.findOne({ where: { username: username } });

        await Review.create({
          spotId: spot.id,
          userId: user.id,
          review,
          stars,
          createdAt
        });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    let reviewList = [];
    for (let spotIdx = 0; spotIdx < spotReviews.length; spotIdx++) {
      const { spotName, reviews } = spotReviews[spotIdx];
      const spot = await Spot.findOne({ where: { name: spotName } });
      for (let bookingIdx = 0; bookingIdx < reviews.length; bookingIdx++) {
        const { username, review, stars, createdAt } = reviews[bookingIdx];
        const user = await User.findOne({ where: { username: username } });
        reviewList.push({
          spotId: spot.id,
          userId: user.id,
          review,
          stars,
          createdAt
        });
      }
    }

    await queryInterface.bulkDelete(options, {
      [Op.or]: reviewList
    });
  }
};
