'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'

     await queryInterface.bulkInsert(options, [
      {
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123,
      },
      {
        "ownerId": 2,
        "address": "123 Fake st",
        "city": "Los Angeles",
        "state": "California",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "Fake",
        "description": "Fake place",
        "price": 12,
      },
      {
        "ownerId": 3,
        "address": "1234 Faker st",
        "city": "Paris",
        "state": "California",
        "country": "United States of America",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "anotherFake",
        "description": "Fake place like the last fake place but also fake",
        "price": 12,
      }
     ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Fake', 'AnotherFake']}
    }, {})
  }
};
