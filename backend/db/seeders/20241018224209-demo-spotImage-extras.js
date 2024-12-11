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
      },
      // Final 2 for spot 1
      {
        spotId: 1,
        url: "https://moderncat.com/wp-content/uploads/2014/03/bigstock-46771525_Andrey_Kuzmin-1-1440x980.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg",
        preview: true,
      },
      // Final 3 for spot 2
      {
        spotId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://media.npr.org/assets/img/2023/12/12/gettyimages-1054147940-627235e01fb63b4644bec84204c259f0a343e35b.jpg?s=1100&c=85&f=jpeg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg",
        preview: true,
      },
      // Last 4 for spot 3
      {
        spotId: 3,
        url: "https://www.wfla.com/wp-content/uploads/sites/71/2023/05/GettyImages-1389862392.jpg?w=2560&h=1440&crop=1",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://images.squarespace-cdn.com/content/v1/607f89e638219e13eee71b1e/1684821560422-SD5V37BAG28BURTLIXUQ/michael-sum-LEpfefQf4rU-unsplash.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0c3xlbnwwfHwwfHx8MA%3D%3D",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://cdn.theatlantic.com/thumbor/vDZCdxF7pRXmZIc5vpB4pFrWHKs=/559x0:2259x1700/1080x1080/media/img/mt/2017/06/shutterstock_319985324/original.jpg",
        preview: true,
      },
      // Last 4 for spot 4
      {
        spotId: 4,
        url: "https://mcgeheeclinic.com/wp-content/uploads/2023/12/cat-whiskers.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200",
        preview: false,
      },
      {
        spotId: 4,
        url: "https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_1570.jpg?itok=4nWOikbM",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://www.alleycat.org/wp-content/uploads/2015/03/eevee-again-2.jpg",
        preview: true,
      },
      // Last 4 for spot 5
      {
        spotId: 5,
        url: "https://media.istockphoto.com/id/1443562748/photo/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=vvM97wWz-hMj7DLzfpYRmY2VswTqcFEKkC437hxm3Cg=",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://ca-times.brightspotcdn.com/dims4/default/3653926/2147483647/strip/false/crop/3653x2740+0+0/resize/1486x1115!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fa4%2F84%2Fc0f4dec74535821710b717566760%2Ftn-gnp-me-pet-week-20191224-1.jpg",
        preview: false,
      },
      {
        spotId: 5,
        url: "https://d2zp5xs5cp8zlg.cloudfront.net/image-79322-800.jpg",
        preview: true,
      },
      {
        spotId: 5,
        url: "https://media.4-paws.org/8/b/f/4/8bf45f56549cff7f705eb200f5ec5f6a9b335baf/VIER%20PFOTEN_2020-10-07_00138-1806x1804-720x719.jpg",
        preview: true,
      },
      // Last 4 for spot 6
      {
        spotId: 6,
        url: "https://www.wondercide.com/cdn/shop/articles/Upside_down_gray_cat.png?v=1685551065&width=1100",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://www.vets4pets.com/siteassets/species/cat/cat-close-up-of-side-profile.jpg",
        preview: false,
      },
      {
        spotId: 6,
        url: "https://nationalzoo.si.edu/sites/default/files/styles/wide/public/animals/20110217-116mm.jpg?itok=U5y7Rywn",
        preview: true,
      },
      {
        spotId: 6,
        url: "https://cdn.britannica.com/36/234736-050-4AC5B6D5/Scottish-fold-cat.jpg",
        preview: true,
      },
      // Last 4 for spot 7
      {
        spotId: 7,
        url: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdluww7UzdCb30ISxIMytNNPMdjddLIHff52r0tzW3aVltCTXAF7y5Itjz_C8QHGqAJo8&usqp=CAU",
        preview: false,
      },
      {
        spotId: 7,
        url: "https://petlibro.com/cdn/shop/files/shutterstock_1422948287.jpg?v=1704968235",
        preview: true,
      },
      {
        spotId: 7,
        url: "https://bestfriends.org/sites/default/files/styles/hero_mobile/public/hero-dash/Asana3808_Dashboard_Standard.jpg?h=ebad9ecf&itok=cWevo33k",
        preview: true,
      },
      // Last 4 for spot 8
      {
        spotId: 8,
        url: "https://cdn.royalcanin-weshare-online.io/WWkRPmYBG95Xk-RB2d3n/v1/ec2h-does-a-cat-fit-with-your-lifestyle-hero-cat",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://i.ytimg.com/vi/feEMKVcFyC4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRnp5fFToaizxzl2wu9G78jacEjw",
        preview: false,
      },
      {
        spotId: 8,
        url: "https://cdn.prod.website-files.com/5e55edd70aff9d4e8cf28aed/60a42459841a596126136981_wellness.png",
        preview: true,
      },
      {
        spotId: 8,
        url: "https://www.purina.in/sites/default/files/2023-05/feast.png",
        preview: true,
      },
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
