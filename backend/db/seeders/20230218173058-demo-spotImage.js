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
        url: 'https://imgs.search.brave.com/FdcEVC8EwuElK4v2hH5liDB4Lz4iYNt0RViZNF9Bnhs/rs:fit:1200:1024:1/g:ce/aHR0cDovL3d3dy5u/aXZhc2EubGsvd3At/Y29udGVudC91cGxv/YWRzLzIwMTQvMDkv/QW1hemluZy1hcmNo/aXRlY3R1cmUtZGVz/aWducy1sdXh1cnkt/YW5kLWJlYXV0aWZ1/bC1ob3VzZS1leHRl/cmlvcnMtd2l0aC1j/dXJ2aW5nLXN3aW1t/aW5nLXBvb2wtYW5k/LWRlY2std2l0aC1j/b29sLWxpZ2h0aW5n/LXZpZXctZXZlbmlu/Z19uaXZhc2FfbGsu/anBn',
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
