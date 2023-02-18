const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Spot, Review, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt'
    ]
  });
  return res.json(allSpots)
})

module.exports = router;
