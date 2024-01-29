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
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Highclere_Castle_%28April_2011%29_2.jpg/1920px-Highclere_Castle_%28April_2011%29_2.jpg"
  },
  {
    reviewId: 1,
    url: "https://i0.wp.com/www.nationalreview.com/wp-content/uploads/2023/03/real-downton-abbey-7.jpg?fit=1481%2C864&ssl=1"
  },
  {
    reviewId: 2,
    url: "https://travel.home.sndimg.com/content/dam/images/travel/fullset/2014/02/04/df/castle-secrets-and-legends-highclere-castle-tour-ss-001.jpg.rend.hgtvcom.966.644.suffix/1491584206818.jpeg"
  },
  {
    reviewId: 3,
    url: "https://d32uwaumftsuh7.cloudfront.net/Pictures/780xany/1/8/0/19180_castle855202_1920_269939.jpg",
  },
  {
    reviewId: 4,
    url: "https://static.wikia.nocookie.net/downtonabbey/images/c/c0/Alnwick_Castle_-_Drawing_Room.jpg/revision/latest/scale-to-width-down/1000?cb=20150302172743"
  },
  {
    reviewId: 5,
    url: "https://eu-assets.simpleview-europe.com/cotswolds/imageresizer/?image=%2Fdmsimgs%2FBampton_21_Hires_427675500.jpg&action=ProductDetail"
  },
  {
    reviewId: 6,
    url: "https://eu-assets.simpleview-europe.com/cotswolds/imageresizer/?image=%2Fdmsimgs%2FBampton_17_Hires_838267534.jpg&action=ProductDetail"
  },
  {
    reviewId: 7,
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Bridgewater_House%2C_London_SW1.jpg"
  },
  {
    reviewId: 8,
    url: "https://i.pinimg.com/originals/52/2d/d7/522dd7ad296640e10b8f7036bc6fb072.jpg"
  },
  {
    reviewId: 9,
    url: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.6435-9/67507955_10217524322571350_7196843519837732864_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=755d08&_nc_ohc=yQNLwCuVDzMAX9iIQRQ&_nc_ht=scontent-sjc3-1.xx&oh=00_AfBMawQrCofpOBLPOj82AyR2Rf_i1s-RujwVlQt1DwuzGg&oe=65DE49FE"
  },
  {
    reviewId: 9,
    url: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.6435-9/67390835_10217524328411496_5617682807871504384_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=755d08&_nc_ohc=bcXSTpU26_cAX_klOOL&_nc_ht=scontent-sjc3-1.xx&oh=00_AfC6rcZzZrGCjohIdw36CtG1yA49wlH4SaFPQXIHQW_tWQ&oe=65DE4568"
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
