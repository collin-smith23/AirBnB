const express = require('express');
const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, Booking, SpotImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check } = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const booking = require('../../db/models/booking');
const { all } = require('./spots');

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

  if(bookings.length === 0){
    return res.status(404).json({
      "message": "User has no bookings"
    })
  }

  let spotId = bookings[0].Spot.id

  const spot = await Spot.findByPk(spotId)



  const previewImage = await SpotImage.findOne({
    where: {spotId},
    attributes: ['url']
  })

  let allBookings = [];

  if(bookings.length > 0){
  bookings.forEach(booking => {
     {
      booking = [
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
    allBookings.push(booking)
  }
})
  return res.json(allBookings)

}
})

//edit a booking

router.put('/:bookingId', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.bookingId
  const {startDate, endDate} = req.body;
  const jsStartDate = new Date(startDate).toDateString()
  const jsEndDate = new Date(endDate).toDateString()
  const currentDate = new Date();



  const booking = await Booking.findByPk(bookingId);
  //error response
  if(!booking){
    return res.status(404).json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  }

  const existingBookings = await Booking.findAll({
    include: {
      where: {id: booking.spotId},
      model: Spot,
    }
  })

   //conflict error
   if (existingBookings.length > 0){
    let conflictError = {
      "message": "Sorry, this spot is already booked for the specified dates",
      "statusCode": 403,
      "errors": {}
    }
     for (let booking of existingBookings) {
      let bookingStart = booking.startDate.toDateString()
      let bookingEnd = booking.endDate.toDateString()

      if (bookingStart == jsStartDate && bookingEnd == jsEndDate){
        conflictError.errors = {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
         return res.json(conflictError)
      }
      if (bookingStart == jsStartDate){
        conflictError.errors = {
          "startDate": "Start date conflicts with an existing booking",
        }
        return res.json(conflictError)
      }
      if (bookingEnd === jsEndDate){
        conflictError.errors = {
          "endDate": "End date conflicts with an existing booking"
        }
        return res.json(conflictError)
      }
    }
  }

  if (userId === booking.userId){
    //body validation
    if (startDate > endDate){
      return res.status(400).json({
        "message": "Validation error",
        "statusCode": 400,
        "errors": {
          "endDate": "endDate cannot come before startDate"
        }
      })
    }

    //booking has past end date
    if (currentDate > endDate){
      return res.status(403).json({
        "message": "Past bookings can't be modified",
        "statusCode": 403
      })
    }

    if (booking){
      booking.update({
        startDate,
        endDate
      })
      return res.json(booking)
    } else {
      return res.status(404).json({
        "message": "Booking couldn't be found",
        "statusCode": 404
      })
    }
  }else{
    return res.status(400).json({
      "message": 'Invalid permissions to edit booking'
    })
  }
})





module.exports = router
