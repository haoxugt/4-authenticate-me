'use strict';

const { Op } = require('sequelize');
const { Spot, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const ownerSpots = [
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Highclere Castle",
        city: "Highclere",
        state: "Newbury",
        country: "United Kingdom",
        lat: 51.326667,
        lng: -1.361389,
        name: "Downton Abbey",
        description: "It is a Grade I listed country house built in 1679.",
        price: 186.36
      },
      {
        address: "14 Cleveland Row",
        city: "London",
        state: "Great London",
        country: "United Kingdom",
        lat: 51.504722,
        lng: -0.14,
        name: "Grantham's House",
        description: "It is a Grade I listed country house built in 1854.",
        price: 134.99
      }
    ]
  },
  {
    ownerUsername: "EdithPelham",
    spots: [
      {
        address: "Alnwick Castle",
        city: "Alnwick",
        state: "Northumberland",
        country: "United Kingdom",
        lat: 55.4156,
        lng: -1.7059,
        name: "Brancaster Castle",
        description: "It is a Grade I listed country house built in 11th century.",
        price: 109.99
      }
    ]
  },
  {
    ownerUsername: 'CoraCrawley',
    spots: [
      {
        address: "2448 Auburn Ave",
        city: "Cincinnati",
        state: "Ohio",
        country: "United States of America",
        lat: 39.126768,
        lng: -84.507972,
        name: "Levinson's House",
        description: "Second owner was Eugene Zimmennan, a steamboat captain during the Civil War.",
        price: 100
      }
    ]
  },
  {
    ownerUsername: "MatthewCrawley",
    spots: [
      {
        address: "Church View",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: 51.727778,
        lng: -1.548889,
        name: "Crawley's House",
        description: "It is a Grade I listed country house built in the 10th or 11th century.",
        price: 90
      }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    for (let ownerIdx = 0; ownerIdx < ownerSpots.length; ownerIdx++) {
      const { ownerUsername, spots } = ownerSpots[ownerIdx];
      const owner = await User.findOne({ where: { username: ownerUsername } });
      for (let spotIdx = 0; spotIdx < spots.length; spotIdx++) {
        const spot = spots[spotIdx];
        await owner.createSpot(spot);
      }
    }
  },

  async down(queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const spotList = ownerSpots.reduce(
      (acc, owner) => [...acc, ...owner.spots],
      []
    );
    await queryInterface.bulkDelete(options, {
      [Op.or]: spotList
    });
  }
};
