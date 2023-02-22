'use strict';

let options = {}
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://imgs.search.brave.com/72Q3AM9fKNL6XR932fXYuwOYq2D91v5cGMoJNxPDZbM/rs:fit:632:225:1/g:ce/aHR0cHM6Ly90c2Uy/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC50/aG1ucHlaakt0YlhQ/YnBLMVFGT2hnSGFG/aiZwaWQ9QXBp',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgs.search.brave.com/f_ODGojPK-AxNm7cDkebT5D2p1_-ysF46MbLRapy2Ds/rs:fit:550:734:1/g:ce/aHR0cHM6Ly9yb29o/b21lLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNy8wOS9i/ZWF1dGlmdWwtaG91/c2UtZGVzaWduMy5q/cGc',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://imgs.search.brave.com/whaLEtrrpvBn2eKwJ6YTRfS39dx_g6Gny-Jod_tAUnw/rs:fit:704:225:1/g:ce/aHR0cHM6Ly90c2Uy/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5T/TF9sZ2ZERjVYZ0xE/VGlTNVp1dFRRSGFF/XyZwaWQ9QXBp',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
