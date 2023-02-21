'use strict';

let options = {};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Nice and cozy',
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Good spot and nice food near by',
        stars: 4
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Eh it was alright, neighbors were loud',
        stars: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
