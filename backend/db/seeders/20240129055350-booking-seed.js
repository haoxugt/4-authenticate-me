'use strict';

const { Op } = require('sequelize');
const { User, Spot, Booking } = require('../models');
// const user = require('../models/user');
// const booking = require('../models/booking');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotBookings = [
  {
    spotName: "Downton Abbey-Spot1",
    bookings: [
      {
        username: "MatthewCrawley",
        startDate: "2015-08-20",
        endDate: "2018-09-01"
      },
      {
        username: "HenryTalbot",
        startDate: "2022-04-03",
        endDate: "2023-07-07"
      }
    ]
  },
  {
    spotName: "Brancaster Castle-Spot3",
    bookings: [
      {
        username: "RobertCrawley",
        startDate: "2016-02-01",
        endDate: "2016-02-15"
      },
      {
        username: "CoraCrawley",
        startDate: "2016-02-16",
        endDate: "2016-02-26"
      }
    ]
  },
  {
    spotName: "Crawley's House-Spot5",
    bookings: [
      {
        username: "MaryCrawley",
        startDate: "2018-03-14",
        endDate: "2018-03-21"
      }
    ]
  },
  {
    spotName: "Grantham's House-Spot2",
    bookings: [
      {
        username: "MatthewCrawley",
        startDate: "2016-06-08",
        endDate: "2016-06-22"
      }
    ]
  },
  {
    spotName: "Downton Abbey-Spot1",
    bookings: [
      {
        username: "MatthewCrawley",
        startDate: "2024-01-01",
        endDate: "2024-03-10"
      }
    ]
  },
  {
    spotName: "Downton Abbey-Spot1",
    bookings: [
      {
        username: "MatthewCrawley",
        startDate: "2024-05-10",
        endDate: "2024-05-20"
      }
    ]
  },
  {
    spotName: "Downton Abbey-Spot1",
    bookings: [
      {
        username: "MatthewCrawley",
        startDate: "2024-04-10",
        endDate: "2024-04-20"
      },
      {
        username: "HenryTalbot",
        startDate: "2022-04-03",
        endDate: "2023-07-07"
      }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let spotIdx = 0; spotIdx < spotBookings.length; spotIdx++) {
      const { spotName, bookings } = spotBookings[spotIdx];
      const spot = await Spot.findOne({ where: { name: spotName } });
      for (let bookingIdx = 0; bookingIdx < bookings.length; bookingIdx++) {
        const { username, startDate, endDate } = bookings[bookingIdx];
        const user = await User.findOne({ where: { username: username } });

        await Booking.create({
          spotId: spot.id,
          userId: user.id,
          startDate,
          endDate
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    let bookingList = [];
    for (let spotIdx = 0; spotIdx < spotBookings.length; spotIdx++) {
      const { spotName, bookings } = spotBookings[spotIdx];
      const spot = await Spot.findOne({ where: { name: spotName } });
      for (let bookingIdx = 0; bookingIdx < bookings.length; bookingIdx++) {
        const { username, startDate, endDate } = bookings[bookingIdx];
        const user = await User.findOne({ where: { username: username } });
        bookingList.push({
          spotId: spot.id,
          userId: user.id,
          startDate,
          endDate
        });
      }
    }

    await queryInterface.bulkDelete(options, {
      [Op.or]: bookingList
    });
  }
};
