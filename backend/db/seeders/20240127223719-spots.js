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
        lat: 51.3267,
        lng: -1.3614,
        name: "Downton Abbey",
        description: "Highclere Castle is a Grade I listed country house built in 1679 and largely renovated in the 1840s, with a park designed by Capability Brown in the 18th century. The 5,000-acre estate is in Highclere in Hampshire, England, about 5 miles (8 km) south of Newbury, Berkshire, and 9.5 miles (15 km) north of Andover, Hampshire. The 19th-century renovation is in a Jacobethan and Italianate style produced by architect Charles Barry. It is the country seat of the Earls of Carnarvon, a branch of the Anglo-Welsh Herbert family.\nHighclere Castle has been used as a filming location for several films and television series, including 1990s comedy series Jeeves and Wooster, and achieved international fame as the main location for the ITV historical drama series Downton Abbey (2010-15) and the 2019 and 2022 films based on it.\nThe house, Egyptian exhibition, and gardens are open to the public for self-guided tours during the summer months and at other times during the rest of the year, such as Christmas and Easter. The house also holds ticketed events, such as the Battle Proms picnic concert, and special guided tours throughout the year.",
        price: 186.36
      },
      {
        address: "14 Cleveland Row",
        city: "London",
        state: "Great London",
        country: "United Kingdom",
        lat: 51.5047,
        lng: -0.14,
        name: "Grantham's House",
        description: "Bridgewater House is a townhouse located at 14 Cleveland Row in the St James's area of London, England. It is a Grade I listed building.\nThe exterior appears as Marchmain House in the 1981 television adaptation of Brideshead Revisited and as Grantham House, the Crawleys\' London house, in the TV historical drama series Downton Abbey.",
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
        lat: 55.4158,
        lng: -1.7062,
        name: "Brancaster Castle",
        description: "Alnwick Castle is a castle and country house in Alnwick in the English county of Northumberland. It is the seat of the 12th Duke of Northumberland, built following the Norman conquest and renovated and remodelled a number of times. It is a Grade I listed building now the home of Ralph Percy, 12th Duke of Northumberland and his family. In 2016, the castle received over 600,000 visitors per year when combined with adjacent attraction the Alnwick Garden.",
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
        lat: 51.7278,
        lng: -1.5489,
        name: "Crawley's House",
        description: "The Church of Saint Mary the Virgin is the Church of England parish church of Bampton, West Oxfordshire. It is in the Archdeaconry of Dorchester in the Diocese of Oxford.\nThe church was built in the 10th or 11th century as an Anglo-Saxon minster with a tower. In the 12th century it was rebuilt as a cruciform Norman building centred on a crossing under the tower. Gothic additions to the church were made several times in the 13th, 14th and 15th centuries. The church is a Grade I listed building.\nSt Mary's is used as the set of St Michael and All Angels' Church in the television series Downton Abbey. Churchgate House is additionally used as the set of Crawley House, the residence of Isobel and Matthew Crawley.",
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
        lat: 51.4989,
        lng: -1.1227,
        name: "Basildon Park",
        description: "Basildon Park is a country house situated 2 miles (3 kilometres) south of Goring-on-Thames and Streatley in Berkshire, between the villages of Upper Basildon and Lower Basildon. It is owned by the National Trust and is a Grade I listed building. The house was built between 1776 and 1783 for Sir Francis Sykes and designed by John Carr in the Palladian style at a time when Palladianism was giving way to the newly fashionable neoclassicism. Thus, the interiors are in a neoclassical \"Adamesque\" style.\nThe interiors of Basildon stood in for the Crawley family's London mansion, Grantham House, on the series Downton Abbey.",
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
        lng: -122.3107,
        name: "Filoli",
        description: "Filoli, also known as the Bourn-Roth Estate, is a country house set in 16 acres (6.5 ha) of formal gardens surrounded by a 654-acre (265 ha) estate, located in Woodside, California, about 25 miles (40 km) south of San Francisco, at the southern end of Crystal Springs Reservoir, on the eastern slope of the Santa Cruz Mountains. Now owned by the National Trust for Historic Preservation, Filoli is open to the public. The site is both a California Historical Landmark and listed on the National Register of Historic Places.",
        price: 65
      }
    ]
  },
  {
    ownerUsername: "DarioSattui",
    spots: [
      {
        address: "4045 St Helena Hwy",
        city: "Calistoga",
        state: "California",
        country: "USA",
        lat: 38.5584,
        lng: -122.5426,
        name: "Castello di Amorosa",
        description: "Castello di Amorosa is a winery located near Calistoga, California. The winery opened to the public in April 2007, as the project of a fourth-generation vintner, Dario Sattui, who also owns and operates the V. Sattui Winery named after his great-grandfather, Vittorio Sattui, who originally established a winery in San Francisco in 1885 after emigrating from Italy to California.",
        price: 65
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
        lat: 39.1268,
        lng: -84.5080,
        name: "Levinson's House",
        description: "Cora Levinson's prototype is from Helena Keith-Falconer, Countess of Kintore, formerly Helena Montagu, Duchess of Manchester, was an American heiress who twice married into the British aristocracy, firstly to the 9th Duke of Manchester and then to the 10th Earl of Kintore. Helena was born in Cincinnati, Hamilton County, Ohio. She was the only child of Eugene Zimmerman and wife Marietta Zimmerman.\nZimmerman's family lived at 2448 Auburn Avenue, the southeast corner of Auburn and McMillan in Mount Auburn, an affluent neighborhood in Cincinnati, Hamilton County, Ohio",
        price: 100
      }
    ]
  },
  {
    ownerUsername: "NickHoward",
    spots: [
      {
        address: "Castle Howard",
        city: "York",
        state: "North Yorkshire",
        country: "United Kingdom",
        lat: 54.121389,
        lng: -0.905833,
        name: "Castle Howard",
        description: "Castle Howard is a stately home in North Yorkshire, England, within the civil parish of Henderskelfe, located 15 miles (24 km) north of York. It is a private residence and has been the home of the Carlisle branch of the Howard family for more than 300 years. Castle Howard is not a fortified structure, but the term \"castle\" is sometimes used in the name of an English country house that was built on the site of a former castle.\nThe house is familiar to television and film audiences as the fictional \"Brideshead\", both in Granada Television's 1981 adaptation of Evelyn Waugh's Brideshead Revisited and in a two-hour 2008 adaptation for cinema.",
        price: 115
      }
    ]
  },
  {
    ownerUsername: "AndreHugel",
    spots: [
      {
        address: "12 Rue des Tanneurs",
        city: "Colmar",
        state: "Alsace",
        country: "France",
        lat: 48.0753,
        lng: 7.3593,
        name: "Brasserie Des Tanneurs",
        description: "Nestling in the heart of Colmar's historic centre, the Brasserie des Tanneurs enjoys an ideal central location, making it a must for visitors in search of a unique tasting experience. Situated at the foot of the unmissable Koïfhus and the colourful facades of the old town, this Alsatian Brasserie offers a real haven for discovery-seekers in search of authenticity.\nThe menu of traditional or revisited dishes showcases these culinary delights prepared using fresh, seasonal ingredients from local producers, which blend harmoniously with regional beers and wines. Each bite is a gustatory journey, a symphony of subtle tastes that celebrate Alsace's culinary heritage.\nThe team, true ambassadors of Alsatian hospitality, welcome you with kindness and guide you through the menu, sharing their passion for our sweet and savoury specialities.\nTheir commitment to quality and attention to detail is reflected in every plate that leaves the kitchen, offering an exceptional culinary experience so that every stroke of the fork is a true ode to regional flavours and an immersion in the Alsatian terroir.",
        price: 123
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
