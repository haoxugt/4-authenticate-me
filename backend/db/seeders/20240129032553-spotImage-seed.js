'use strict';

const { Op } = require('sequelize');
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spot_spotImages = [
  {
    spotName: "Downton Abbey",
    spotImages: [
      {
        url: "https://www.pbs.org/wgbh/masterpiece/wp-content/uploads/2020/06/downton-abbey-highclere-1920x1080-1.jpg",
        preview: true
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Highclere_Castle.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Grantham's House",
    spotImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bridgewater_House.jpg/1280px-Bridgewater_House.jpg",
        preview: true
      },
      {
        url: "https://static.wikia.nocookie.net/downtonabbey/images/7/74/Bridgewater2.jpg/revision/latest?cb=20180822194235",
        preview: false
      }
    ]
  },
  {
    spotName: "Brancaster Castle",
    spotImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alnwick_Castle_in_uk.jpg/1280px-Alnwick_Castle_in_uk.jpg",
        preview: true
      },
      {
        url: "https://www.alnwickcastle.com/_assets/media/library/9493.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Levinson's House",
    spotImages: [
      {
        url: "https://images1.loopnet.com/i2/v_ieoBtBeIIpBcDF0aVDcK3GrUVnahs5oHp43_DSffs/116/2448-Auburn-Ave-Cincinnati-OH-Primary-Photo-1-LargeHighDefinition.jpg",
        preview: true
      },
      {
        url: "https://rm12filereader.rentmanager.com/files/get/?EID=uptownrp&FKey=T1I4T3F6TStjS1U9S3pTdXYvUHE1eEpDVkx2dzhVOXZtdz09OXdOQ3Z3MnpldVNEbU9sd1VtaW9yTWFDaWFpM1BRNyt5VHJhb0NhbjRoS2hNOXRGaytTRkc4dFVlTmNrRGsxRWsvdnh5MmhMS0VGS2xwSndlQjViYzZ2Q3F6aFYvZ1VVaGpPSExHS2lJV3BrR2JnUW5GTEdJbWlwaWU2bHpvWlRkaU4yeWtkcUJPRVh1V1orZ3R6WFd1azE2ZFY3UDdSQ3BJeEhNazJMbEx3L3c0N1Q4NWlyVU1zZWFOVE5QOWdh",
        preview: false
      }
    ]
  },
  {
    spotName: "Crawley's House",
    spotImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/The_Rectory-Bampton.JPG/1920px-The_Rectory-Bampton.JPG",
        preview: true
      }
    ]
  },
  {
    spotName: "Crawley's House",
    spotImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/The_Rectory-Bampton.JPG/1920px-The_Rectory-Bampton.JPG",
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
