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
        email: 'roberty@downton.com',
        username: 'RobertCrawley',
        firstName: 'Robert',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('RobertCrawley')
      },
      {
        email: 'matthew@lawyer.org',
        username: 'MatthewCrawley',
        firstName: 'Matthew',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('MatthewCrawley')
      },
      {
        email: 'cora@downton.com',
        username: 'CoraCrawley',
        firstName: 'Cora',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('CoraCrawley')
      },
      {
        email: 'mary@downton.com',
        username: 'MaryCrawley',
        firstName: 'Mary',
        lastName: 'Crawley',
        hashedPassword: bcrypt.hashSync('MaryCrawley')
      },
      {
        email: 'edith@brancaster.com',
        username: 'EdithPelham',
        firstName: 'Edith',
        lastName: 'Pelham',
        hashedPassword: bcrypt.hashSync('EdithPelham')
      },
      {
        email: 'henry@downton.com',
        username: 'HenryTalbot',
        firstName: 'Henry',
        lastName: 'Talbot',
        hashedPassword: bcrypt.hashSync('HenryTalbot')
      },
      {
        email: 'rose@duneagle.com',
        username: 'RoseAldridge',
        firstName: 'Rose',
        lastName: 'Aldridge',
        hashedPassword: bcrypt.hashSync('RoseAldridge')
      },
      {
        email: 'national@filoli.org',
        username: 'NationalTrust',
        firstName: 'National',
        lastName: 'Trust',
        hashedPassword: bcrypt.hashSync('NationalTrust')
      },
      {
        email: 'haoxu@net.com',
        username: 'HaoXu',
        firstName: 'Hao',
        lastName: 'Xu',
        hashedPassword: bcrypt.hashSync('HaoXu')
      },
      {
        email: 'shumei@miho.jp',
        username: 'Shumei',
        firstName: 'Shumei',
        lastName: 'Foundation',
        hashedPassword: bcrypt.hashSync('Shumei')
      },
      {
        email: 'nick@howard.co',
        username: 'NickHoward',
        firstName: 'Nick',
        lastName: 'Howard',
        hashedPassword: bcrypt.hashSync('NickHoward')
      },
      {
        email: 'andre@hugel.com',
        username: 'AndreHugel',
        firstName: 'Andre',
        lastName: 'Hugel',
        hashedPassword: bcrypt.hashSync('AndreHugel')
      },
      {
        email: 'dario@cda.com',
        username: 'DarioSattui',
        firstName: 'Dario',
        lastName: 'Sattui',
        hashedPassword: bcrypt.hashSync('DarioSattui')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['RobertCrawley', 'CoraCrawley', 'MaryCrawley', 'MatthewCrawley',
                  'EdithPelham', 'HenryTalbot', 'RoseAldridge', 'NationalTrust',
                  'haoxugt', 'Shumei', 'NickHoward', 'AndreHugel', 'DarioSattui']
      }
    }, {});
  }
};
