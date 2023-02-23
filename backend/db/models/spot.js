'use strict';
const {Model, Sequelize} = require('sequelize');

const { Review } = require('../models/index.js')

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'})
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true})
      Spot.hasMany(models.Review, {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true})
      Spot.hasMany(models.Booking, {foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true})
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
