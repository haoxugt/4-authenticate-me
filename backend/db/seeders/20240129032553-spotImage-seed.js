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
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708568972/Highclere_01_somjuf.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708569660/Highclere_06_drcsar.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708569883/Highclere_03_2_ijzxwq.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708569886/Highclere_04_2_rdg16x.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708568973/Highclere_05_nlj6hb.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Grantham's House",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708576497/Bridgewater_House_01_2_o3l7nd.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708570702/Bridgewater_House_02_zmsgz4.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708570702/Bridgewater_House_03_gjbcpj.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708570703/Bridgewater_House_04_k095jq.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708570704/Bridgewater_House_05_w2qsnq.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Brancaster Castle",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708555979/AlnwickCastle_01_q02jwu.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708556005/AlnwickCastle_02_dgued8.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708556008/AlnwickCastle_04_hd7cx6.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708556007/AlnwickCastle_05_jmh3w1.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708556006/AlnwickCastle_03_uzpqox.jpg",
        preview: false
      },
    ]
  },
  {
    spotName: "Duneagle Castle",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708624928/Frontend/Inveraray_Castle/Inveraray_02_jeu2it.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708624931/Frontend/Inveraray_Castle/Inveraray_05_msesy5.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708624929/Frontend/Inveraray_Castle/Inveraray_03_klgqcz.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708624933/Frontend/Inveraray_Castle/Inveraray_06_snp7d9.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708624935/Frontend/Inveraray_Castle/Inveraray_07_wzgp4j.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Basildon Park",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708575742/Basildon_Park_01_x9mvmr.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708575742/Basildon_Park_02_g7z0ua.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708575744/Basildon_Park_04_oiz23t.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708575744/Basildon_Park_05_gl1wds.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708575742/Basildon_Park_03_gplr20.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Crawley's House",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708577653/Crawley_01_zaprmx.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708577653/Crawley_02_pn5qfh.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708577654/Crawley_03_lbmqwt.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708577656/Crawley_04_rgdofp.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708585605/Crawley_05_mlkl71.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Levinson's House",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636736/Frontend/Ohio/Ohio_01_cfhqvl.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708585637/ohio_02_d8lcue.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708585639/ohio_03_nlkuh2.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708585641/ohio_04_fjwpio.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708585642/Ohio_05_iadafa.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Miho Museum",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636642/Frontend/Miho/Miho_01_oe1jnt.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636644/Frontend/Miho/Miho_02_q4oizj.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636645/Frontend/Miho/Miho_03_w0bimj.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636646/Frontend/Miho/Miho_04_txed9q.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708636649/Frontend/Miho/Miho_05_wssft6.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Filoli",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708640751/Frontend/Filoli/Filoli_01_nbwojw.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708640753/Frontend/Filoli/filoli_02_usivg4.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708640755/Frontend/Filoli/filoli_03_nemuhr.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708640756/Frontend/Filoli/filoli_04_gouier.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708640759/Frontend/Filoli/filoli_05_zdi0np.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Castle Howard",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708670771/Frontend/Howard/Howard_01_pm1umz.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708670773/Frontend/Howard/Howard_02_big3on.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708670774/Frontend/Howard/Howard_03_y8amis.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708670777/Frontend/Howard/Howard_04_hgajcd.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708671136/Frontend/Howard/Howard_06_bdiein.jpg",
        preview: false
      }
    ]
  },
  {
    spotName: "Brasserie Des Tanneurs",
    spotImages: [
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708676500/Frontend/Colmar/Colmar_09_dyypbj.jpg",
        preview: true
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708676493/Frontend/Colmar/Colmar_01_fke9t1.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708677117/Frontend/Colmar/Colmar_04_fkvcbz.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708676498/Frontend/Colmar/Colmar_07_ycgfgd.jpg",
        preview: false
      },
      {
        url: "https://res.cloudinary.com/dwrohcbtx/image/upload/v1708677008/Frontend/Colmar/Colmar_10_lcxogd.jpg",
        preview: false
      }
    ]
  },
  // {
  //   spotName: "",
  //   spotImages: [
  //     {
  //       url: "",
  //       preview: true
  //     },
  //     {
  //       url: "",
  //       preview: false
  //     },
  //     {
  //       url: "",
  //       preview: false
  //     },
  //     {
  //       url: "",
  //       preview: false
  //     },
  //     {
  //       url: "",
  //       preview: false
  //     }
  //   ]
  // },

];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    for (let spotImageIdx = 0; spotImageIdx < spot_spotImages.length; spotImageIdx++) {
      const { spotName, spotImages } = spot_spotImages[spotImageIdx];
      const spot = await Spot.findOne({
        where: {
          name: spotName
        }
      });

      for (let imgIdx = 0; imgIdx < spotImages.length; imgIdx++) {
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
