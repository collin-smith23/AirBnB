'use strict';

const { query } = require('express');

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2023, 02, 18',
        endDate: '2023, 02, 22'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023, 03, 18',
        endDate: '2023, 03, 22'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023, 04, 18',
        endDate: '2023, 04, 22'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
