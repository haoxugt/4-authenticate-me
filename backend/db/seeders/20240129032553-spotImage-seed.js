'use strict';

const { Op } = require('sequelize');
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spot_spotImages = [
  {
    spotName: "Downton Abbey-Spot1",
    spotImages: [
      {
        url: "SpotImage-1.jpg",
        preview: true
      },
      {
        url: "SpotImage-2.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Grantham's House-Spot2",
    spotImages: [
      {
        url: "SpotImage-3.jpg",
        preview: true
      },
      {
        url: "SpotImage-4.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Brancaster Castle-Spot3",
    spotImages: [
      {
        url: "SpotImage-5.jpg",
        preview: true
      },
      {
        url: "SpotImage-6.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Levinson's House-Spot4",
    spotImages: [
      {
        url: "SpotImage-7.jpg",
        preview: true
      },
      {
        url: "SpotImage-8.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Crawley's House-Spot5",
    spotImages: [
      {
        url: "SpotImage-9.jpg",
        preview: true
      }
    ]
  },
  {
    spotName: "Crawley's House-Spot5",
    spotImages: [
      {
        url: "SpotImage-10.jpg",
        preview: true
      }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    for (let spotImageIdx = 0; spotImageIdx < spot_spotImages.length; spotImageIdx++) {
      const {spotName, spotImages } = spot_spotImages[spotImageIdx];
      const spot =  await Spot.findOne({
        where: {
          name: spotName
        }
      });

      for (let imgIdx = 0 ; imgIdx < spotImages.length; imgIdx++) {
        const spotImage = spotImages[imgIdx];
        await spot.createSpotImage(spotImage);
      }
    }
  },

  async down(queryInterface, Sequelize) {

    options.tableName = 'SpotImages';
    const spotImageList = spot_spotImages.reduce(
      (acc, spot) => [...acc, ...spot.spotImages],
      []
    );

    await queryInterface.bulkDelete(options, {
      [Op.or]: spotImageList
    });
  }
};
