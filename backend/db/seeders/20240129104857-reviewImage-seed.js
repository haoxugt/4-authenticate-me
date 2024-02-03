'use strict';

const { Op } = require('sequelize');
const { Review, ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const review_reviewImages = [
  {
    reviewId: 1,
    url: "ReviewImage1.jpg"
  },
  {
    reviewId: 1,
    url: "ReviewImage2.jpg"
  },
  {
    reviewId: 2,
    url: "ReviewImage3.jpg"
  },
  {
    reviewId: 3,
    url: "ReviewImage4.jpg",
  },
  {
    reviewId: 4,
    url: "ReviewImage5.jpg"
  },
  {
    reviewId: 5,
    url: "ReviewImage6.jpg"
  },
  {
    reviewId: 6,
    url: "ReviewImage7.jpg"
  },
  {
    reviewId: 7,
    url: "ReviewImage8.jpg"
  },
  {
    reviewId: 8,
    url: "ReviewImage9.jpg"
  },
  {
    reviewId: 9,
    url: "ReviewImage10.jpg"
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(review_reviewImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, {
      [Op.or]: review_reviewImages
    });
  }
};
