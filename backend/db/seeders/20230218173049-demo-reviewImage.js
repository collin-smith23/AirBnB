'use strict';

let options = {}
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://imgs.search.brave.com/FdcEVC8EwuElK4v2hH5liDB4Lz4iYNt0RViZNF9Bnhs/rs:fit:1200:1024:1/g:ce/aHR0cDovL3d3dy5u/aXZhc2EubGsvd3At/Y29udGVudC91cGxv/YWRzLzIwMTQvMDkv/QW1hemluZy1hcmNo/aXRlY3R1cmUtZGVz/aWducy1sdXh1cnkt/YW5kLWJlYXV0aWZ1/bC1ob3VzZS1leHRl/cmlvcnMtd2l0aC1j/dXJ2aW5nLXN3aW1t/aW5nLXBvb2wtYW5k/LWRlY2std2l0aC1j/b29sLWxpZ2h0aW5n/LXZpZXctZXZlbmlu/Z19uaXZhc2FfbGsu/anBn'
      },
      {
        reviewId: 2,
        url: 'https://imgs.search.brave.com/K31pDRYWJxlRn756P8bVW3OutrhjBOAWz0lQIzBmwAY/rs:fit:1024:682:1/g:ce/aHR0cHM6Ly90aGVh/cmNoaXRlY3R1cmVk/ZXNpZ25zLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxOC8w/OS80LUJlYXV0aWZ1/bC1ob3VzZXMtaW4t/bmlnZXJpYS0xMDI0/eDY4Mi5qcGc'
      },
      {
        reviewId: 3,
        url: 'https://imgs.search.brave.com/caKMTU6j0TJ6PPabQL1RH0bUnDU5ZDFMHpBLrffGnjY/rs:fit:1000:666:1/g:ce/aHR0cHM6Ly8xLmJw/LmJsb2dzcG90LmNv/bS8tc1VKZTFINnZx/d0UvVFdZdVhnakVM/eEkvQUFBQUFBQUFB/aUUvUk1hbkhXTlR2/RlEvczE2MDAvRWxs/aXMrUmVzaWRlbmNl/LmpwZw'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
