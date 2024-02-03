'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'robertcrawley@downtonabbey.com',
        username: 'RobertCrawley',
        firstName: 'Robert',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('RobertCrawley')
      },
      {
        email: 'coracrawley@downtonabbey.com',
        username: 'CoraCrawley',
        firstName: 'Cora',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('CoraCrawley')
      },
      {
        email: 'marycrawley@downtonabbey.com',
        username: 'MaryCrawley',
        firstName: 'Mary',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('MaryCrawley')
      },
      {
        email: 'matthewcrawley@machesterlawyer.org',
        username: 'MatthewCrawley',
        firstName: 'Matthew',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('MatthewCrawley')
      },
      {
        email: 'edithppelham@brancastercastle.com',
        username: 'EdithPelham',
        firstName: 'Edith',
        lastName: 'Pelham',
        hashedPassword: bcrypt.hashSync('EdithPelham')
      },
      {
        email: 'henryttalbot@downtonabbey.com',
        username: 'HenryTalbot',
        firstName: 'Henry',
        lastName: 'Talbot',
        hashedPassword: bcrypt.hashSync('HenryTalbot')
      },
      {
        email: 'seventh.user@downtonabbey.com',
        username: 'seventhuser',
        firstName: 'Seventh',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('secret password')
      },
      {
        email: 'eighth.user@downtonabbey.com',
        username: 'eighthuser',
        firstName: 'Eighth',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('secret password')
      },
      {
        email: 'ninth.user@downtonabbey.com',
        username: 'ninthuser',
        firstName: 'Ninth',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('secret password')
      },
      {
        email: 'tenth.user@downtonabbey.com',
        username: 'tenthuser',
        firstName: 'Tenth',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('secret password')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['RobertCrawley', 'CoraCrawley', 'MaryCrawley', 'MatthewCrawley', 'EdithPelham', 'HenryTalbot'] }
    }, {});
  }
};
