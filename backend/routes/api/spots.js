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

router.post('/', async (req, res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const userId = req.user.id

  const newSpot = await Spot.create({
    ownerId: userId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })

  if(newSpot){
    return res.status(201).json(newSpot)
  }

})

module.exports = router;
