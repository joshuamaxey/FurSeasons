"use strict";

const { SpotImage } = require("../models");

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg?w=2141",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://www.rd.com/wp-content/uploads/2023/05/GettyImages-1341465008.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1253926491.jpg?resize=2048",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/640px-Cat_November_2010-1a.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://cdn.britannica.com/39/226539-050-D21D7721/Portrait-of-a-cat-with-whiskers-visible.jpg",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://cdn.britannica.com/93/181393-050-9FC2E61A/cat-Alison-Eldridge-orange-Calico.jpg",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://th-thumbnailer.cdn-si-edu.com/bgmkh2ypz03IkiRR50I-UMaqUQc=/1000x750/filters:no_upscale():focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg",
        preview: true,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 4, 5, 6, 7, 8] },
      },
      {}
    );
  },
};
