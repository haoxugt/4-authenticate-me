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
    ownerUsername: "RoseAldridge",
    spots: [
      {
        address: "Inveraray Castle",
        city: "Inveraray",
        state: "Argyll",
        country: "Scotland",
        lat: 56.237481,
        lng: -5.073576,
        name: "Duneagle Castle",
        description: 'Inveraray Castle is a country house near Inveraray in the county of Argyll, in western Scotland, on the shore of Loch Fyne, Scotland\'s longest sea loch. It is one of the earliest examples of Gothic Revival architecture.\nIt has been the seat of the Dukes of Argyll, chiefs of Clan Campbell, since the 18th century.',
        price: 135.99
      }
    ]
  },
  {
    ownerUsername: "RobertCrawley",
    spots: [
      {
        address: "Lower Basildon",
        city: "Reading",
        state: "Berkshire",
        country: "United Kingdom",
        lat: 32.05,
        lng: 32.05,
        name: "Basildon Park",
        description: "Built in 10-11th century.",
        price: 65
      }
    ]
  },
  {
    ownerUsername: "Shumei",
    spots: [
      {
        address: "300 Momoya Shigarakicho Tashiro",
        city: "Koka",
        state: "Shiga",
        country: "Japan",
        lat: 34.914611,
        lng: 136.022889,
        name: "Miho Museum",
        description: "The Miho Museum opened in November 1997 amid the abundant natural beauty of the mountains of Shigaraki, Shiga prefecture. The collection started by the founder, Mihoko Koyama (1910 - 2003) is designed to fulfill her vision of promoting beauty, peace and joy through art. It includes a wide range of Japanese art, along with ancient art from areas such as Egypt, Western Asia, Greece, Rome, Southern Asia and China.\nThe approach to the museum was designed by architect I.M. Pei, who is renowned for works such as the glass pyramid at the Louvre in Paris. Visitors travel down a walkway enveloped by cherry trees and pass through a tunnel and over a bridge before arriving at the museum. The design was inspired by the ethereal utopia described in the Taohua Yuan Ji (The Peach Blossom Spring), an ancient Chinese work written by Tao Yuanming. The work tells the tale of a fisherman who roams into a grotto after being drawn in by the fragrant scent of a forest of blossoming peach trees. Emerging from the other side, he finds an idyllic village of inhabitants who all live joyfully, and welcome the fisherman into their homes.\nThe Miho Museum has been conceived as a real-world version of this village. We hope you will enjoy the harmonious blend of natural beauty, architecture, art and food it provides amid a vibrant backdrop of seasonal colors.",
        price: 125
      }
    ]
  },
  {
    ownerUsername: "NationalTrust",
    spots: [
      {
        address: "86 Cañada Rd",
        city: "Woodside",
        state: "California",
        country: "US",
        lat: 37.4704,
        lng: -122.310703,
        name: "Filoli",
        description: "Filoli, also known as the Bourn-Roth Estate, is a country house set in 16 acres (6.5 ha) of formal gardens surrounded by a 654-acre (265 ha) estate, located in Woodside, California, about 25 miles (40 km) south of San Francisco, at the southern end of Crystal Springs Reservoir, on the eastern slope of the Santa Cruz Mountains. Now owned by the National Trust for Historic Preservation, Filoli is open to the public. The site is both a California Historical Landmark and listed on the National Register of Historic Places.",
        price: 65
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
