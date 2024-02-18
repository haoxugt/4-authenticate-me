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
        lat: 50.32,
        lng: -1.36,
        name: "Downton Abbey",
        description: "Built in 1679.",
        price: 186.36
      },
      {
        address: "14 Cleveland Row",
        city: "London",
        state: "Great London",
        country: "United Kingdom",
        lat: 20.66,
        lng: 30,
        name: "Grantham's House",
        description: "Built in 1854.",
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
        lat: 0.01,
        lng: -20,
        name: "Brancaster Castle",
        description: "Built in 11th century.",
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
        lat: -20.15,
        lng: -84.51,
        name: "Levinson's House",
        description: "Eugene Zimmennan's house.",
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
        lat: -40.93,
        lng: 70.56,
        name: "Crawley's House",
        description: "Built in 10-11th century.",
        price: 90
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Spot6 address",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: 32.05,
        lng: 32.05,
        name: "Spot6",
        description: "Built in 10-11th century.",
        price: 65
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Spot7 address",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: 37.5,
        lng: 37.5,
        name: "Spot7",
        description: "Built in 10-11th century.",
        price: 85
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Spot8 address",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: 40.01,
        lng: 70.56,
        name: "Spot8",
        description: "Built in 10-11th century.",
        price: 75
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Spot9 address",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: -40.93,
        lng: 40.01,
        name: "Spot9",
        description: "Built in 10-11th century.",
        price: 55
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Spot10 address",
        city: "Bampton",
        state: "West Oxfordshire",
        country: "United Kingdom",
        lat: 31.52,
        lng: 37.94,
        name: "Spot10",
        description: "Built in 10-11th century.",
        price: 45
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
