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
        url: 'https://imgs.search.brave.com/72Q3AM9fKNL6XR932fXYuwOYq2D91v5cGMoJNxPDZbM/rs:fit:632:225:1/g:ce/aHR0cHM6Ly90c2Uy/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC50/aG1ucHlaakt0YlhQ/YnBLMVFGT2hnSGFG/aiZwaWQ9QXBp'
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
