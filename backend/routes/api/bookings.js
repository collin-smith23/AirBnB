const express = require('express');
const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check } = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const booking = require('../../db/models/booking');

//get all bookings of current user

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id

  const bookings = await Booking.findAll({
    where: {userId},
    include: [{
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
    }],
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
  })

  const spotId = bookings[0].Spot.id

  const spot = await Spot.findByPk(spotId)

  const previewImage = await SpotImage.findOne({
    where: {spotId},
    attributes: ['url']
  })

  if(bookings.length > 0){
  bookings.forEach(booking => {
    return res.json({
      "Bookings": [
        {
        "id": booking.id,
        spotId,
        "Spot": {
          spotId,
          "ownerId":spot.ownerId,
          "address": spot.address,
          "city": spot.city,
          "state": spot.state,
          "country": spot.country,
          "lat": spot.lat,
          "lng": spot.lng,
          "name": spot.name,
          "price": spot.price,
          "previewImage": previewImage.url
        },
        userId,
        "startDate" : booking.startDate,
        "endDate": booking.endDate,
        "createdAt": booking.createdAt,
        "updatedAt": booking.updatedAt
      }
    ]
  })
})
} else{
  return res.status(400).json({
    "message": 'user has no bookings'
  })
}
})





module.exports = router
