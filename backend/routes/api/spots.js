const express = require('express');

const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { Sequelize } = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');
const reviewimage = require('../../db/models/reviewimage');

const router = express.Router();

  const validSpot = [
    check('address')
      .exists({checkFalsy: true})
      .withMessage({"message": 'Street address is required'}),
    check('city')
      .exists({checkFalsy: true})
      .withMessage({"message": 'City is required'}),
    check('state')
      .exists({checkFalsy: true})
      .withMessage({"message": 'State is required'}),
    check('country')
      .exists({checkFalsy: true})
      .withMessage({"message": 'Country is required'}),
    check('lat')
      .exists({checkFalsy: true})
      .isDecimal()
      .withMessage({"message": 'Latitude is not valid'}),
    check('lng')
      .exists({checkFalsy: true})
      .isDecimal()
      .withMessage({"message": 'Longitude is not valid'}),
    check('name')
      .exists({checkFalsy: true})
      .isString()
      .isLength({min:1, max: 50})
      .withMessage({"message": 'Name must be less than 50 characters'}),
    check('description')
      .exists({checkFalsy: true})
      .withMessage({"message": 'Description is required'}),
    check('price')
      .exists({checkFalsy: true})
      .withMessage({"message": 'Price per day is required'}),
    handleValidationErrors
  ]

  const reviewIsValid = [
    check('review')
      .exists({checkFalsy: true})
      .withMessage({message: 'Review text is required'}),
    check('stars')
      .exists({checkFalsy: true})
      .isDecimal()
      .isLength({min:1, max:5})
      .withMessage('Stars must be an integer from 1 to 5'),
      handleValidationErrors
  ]

//get spots of a Current User
router.get('/current', async (req, res) => {
  const userId = req.user.id
  const spots = await Spot.findAll({
    where: {ownerId:userId},
    include: [
      {
        association: 'Reviews',
        attributes: []
      },
      {
        association: 'SpotImages',
        attributes: [],
      },
    ],
    group: ['Spot.id','Reviews.spotId', 'SpotImages.id'],
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
      'updatedAt',
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
      [Sequelize.col('SpotImages.url'), 'previewImage']
    ],
  })
  return res.json(spots)
})

//get all spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({
    include: [
      {
        association: 'Reviews',
        attributes: []
      },
      {
        association: 'SpotImages',
        attributes: [],
      },
    ],
    group: ['Spot.id','Reviews.spotId', 'SpotImages.id', 'SpotImages.url'],
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
      'updatedAt',
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
      [Sequelize.col('SpotImages.url'), 'previewImage']
    ],
  });
  return res.json(allSpots)
})

//create a spot
router.post('/', validSpot, handleValidationErrors ,async (req, res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const userId = req.user.id
  const user = Spot.findByPk(userId)


if (user){
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
}

})

//create an image for a spot
router.post('/:spotId/images', async (req, res) => {
  const spotId = req.params.spotId
  const spot = await Spot.findByPk(spotId)
  const {url, preview} = req.body

  //if no spot
  if (!spot) {
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  if (spot){
    // console.log('this is my spot', spot)
    const newSpotImg = await SpotImage.create({
      include: [
        {
          association: 'User',
          attributes:[]
      }
      ],
      spotId: spot.id,
      url,
      preview
    })

    if(newSpotImg){
      return res.status(200).json({
        id: newSpotImg.id,
        url: newSpotImg.url,
        preview: newSpotImg.preview
      })
    }
  }
})

//get reviews by spotId

router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId

  const spot = await Spot.findOne({
    where: {
      id: spotId
    },
    include: [
        {
        model: Review,
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]}
    ]
  });

  if (!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  } else{
    const spotReviews = spot.Reviews;
    return res.json(spotReviews)
  }
})

//create a review

router.post('/:spotId/reviews', reviewIsValid, requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id
  const {review, stars} = req.body;

  const spot = await Spot.findByPk(spotId)

  const reviewExist = await Review.findOne({
    where: {
      userId,
      spotId
    }
  })

  if (!spot){
    return res.status(404).json({
      'message': "Spot couldn't be found",
      "statusCode": 404
    })
  }
  if (reviewExist){
    return res.status(403).json({
      "message": "User already has a review for this spot",
      "statusCode": 403
    })
  }

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars
  })

  if (newReview){
    return res.json(newReview)
  }
})

//create a booking

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {startDate, endDate} = req.body;
  const jsStartDate = new Date(startDate).toDateString()
  const jsEndDate = new Date(endDate).toDateString()

  const spot = await Spot.findByPk(spotId);

  const existingBookings = await Booking.findAll({
    include: {
      where: {id: spotId},
      model: Spot,
    }
  })

  if(!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

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
      if (booking.startDate === jsStartDate){
        conflictError.errors = {
          "startDate": "Start date conflicts with an existing booking",
        }
        return res.json(conflictError)
      }
      if (booking.endDate === jsEndDate){
        conflictError.errors = {
          "endDate": "End date conflicts with an existing booking"
        }
        return res.json(conflictError)
      }
    };
  }

  //spot must not belong to current user
  if (spot.ownerId !== userId){
    //error
    if(startDate >= endDate){
      return res.status(400).json({
        "message": "Validation error",
        "statusCode": 400,
        "errors": {
          "endDate": "endDate cannot be on or before startDate"
        }
      })
    }

    //if all is good
    const newBooking = await Booking.create({
      spotId,
      userId,
      startDate,
      endDate
    })
    return res.json(newBooking)
  }
  else {
    return res.status(400).json({
      "message": 'owner can not create their own booking'
    })
  }
})

//Get all Bookings by spotId

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spotId = req.params.spotId;
  let allBookings = [];

  const bookings = await Booking.findAll({
    where: {spotId},
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }],
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
  })


  const spot = await Spot.findByPk(spotId)

  if (!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  //if user is owner of spot
  if (spot.ownerId === userId){
    for (let booking of bookings){
      booking = [{
        "User": {
          'id': booking.User.id,
          "firstName": booking.User.firstName,
          "lastName": booking.User.lastName
        },
        'id': booking.id,
        spotId,
        "userId": booking.userId,
        "startDate" : booking.startDate,
        "endDate" : booking.endDate,
        "createdAt": booking.createdAt,
        "updatedAt": booking.updatedAt
      }]
      allBookings.push(booking)
    }
    return res.json(allBookings)
  }

  //if user is not owner of spot
  if (spot.ownerId !== userId){
    for (let booking of bookings){
      booking = [{
        "spotId": booking.spotId,
        "startDate" : booking.startDate,
        "endDate" : booking.endDate
      }]
      allBookings.push(booking)
    }
    return res.json(allBookings)
  }


  return res.json(allBookings)

})



//details of spot by id
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    where: {id:spotId},
    include: [
      {
        association: 'Reviews',
        attributes: []
      },
      {
        association: 'SpotImages',
        attributes: ['id', 'url', 'preview'],
      },
    ],
    group: ['Spot.id','Reviews.spotId', 'SpotImages.id'],
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
      'updatedAt',
      [Sequelize.fn('COUNT', Sequelize.col('Reviews.stars')), 'numReviews'],
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
    ],
  })
  //if spot does not exist
  if(!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  return res.json(spot)
})


//edit a spot

router.put('/:spotId', validSpot, requireAuth, async (req, res) => {
  const spotId = req.params.spotId
  const userId = req.user.id
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const spot = await Spot.findByPk(spotId)


  if(spot){
    spot.update({
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
    return res.status(200).json(spot)
  } else {
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
})

//delete a spot

router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId
  const spot = await Spot.findByPk(spotId);

  if (spot){
    await spot.destroy();
    return res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } else {
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
})

module.exports = router;
