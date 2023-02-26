const express = require('express');

const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { Sequelize, ValidationError, Op } = require('sequelize')
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
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
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
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  page = Number(page);
  size = Number(size)
  if (!page) page = 1;
  if (!size) size = 20
  const Spots = [];

  //validation error for query
  const validationError = {
    "message": "Validation Error",
    "statusCode": 400,
    "errors" : {}
  }
  if (page < 1){
    validationError.errors.page = 'Page must be greater than or equal to 1'
  }
  if (size < 1){
    validationError.errors.size = 'Page must be greater than or equal to 1'
  }
  if(maxLat){
  if( maxLat > 90 || Number.isNaN(maxLat)){
    validationError.errors.maxLat = 'Maximum latitude is invalid'
  }}
  if(minLat){
  if (minLat < -90 || Number.isNaN(minLat)){
    validationError.errors.minLat = 'Minimum latitude is invalid'
  }}
  if(minLng){
  if (minLng < -180 || Number.isNaN(minLng)){
    validationError.errors.minLng = 'Minimum longitude is invalid'
  }}
  if(maxLng){
  if(maxLng > 180 || Number.isNaN(maxLng)) {
    validationError.errors.minLng = 'Minimum longitude is invalid'
  }}
  if(minPrice){
    if(minPrice <= 0 || Number.isNaN(minPrice)){
      validationError.errors.minPrice = 'Minimum price must be greater than or equal to 0'
    }
  }
  if(maxPrice){
    if(maxPrice <= 0 || Number.isNaN(maxPrice)){
      validationError.errors.minPrice = 'Maximum price must be greater than or equal to 0'
    }
  }

  if(validationError.errors.hasOwnProperty('page') || validationError.errors.hasOwnProperty('size') ||validationError.errors.hasOwnProperty('maxLat') || validationError.errors.hasOwnProperty('minLat') || validationError.errors.hasOwnProperty('minLng') || validationError.errors.hasOwnProperty('maxLng') || validationError.errors.hasOwnProperty('minPrice') || validationError.errors.hasOwnProperty('maxPrice')){
    return res.status(400).json({validationError})
  }


  const allSpots = await Spot.findAll({
    where: {
      lat : {
        [Op.gte]: minLat || -90,
        [Op.lte]: maxLat || 90
      },
      lng: {
        [Op.gte]: minLng || -180,
        [Op.lte]: maxLng || 180
      },
      price: {
        [Op.gte]: minPrice || 0,
        [Op.lte]: maxPrice || 1000000
      }
    },
    limit: size,
    offset: Math.abs(size * (page -1)),
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
    ],
  });

  let sum = 0;
  let avgRating;

  for (let spot of allSpots){
    sum = 0;
    let reviews = await Review.findAll({
      where: {spotId : spot.id},
      attributes: ['stars']
    })
    reviews.forEach(review => {
      sum += (review.stars)
    });
    avgRating = sum/reviews.length
    let previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      },
      attributes: ['url']
    })
    if (previewImage === null){
      previewImage = {
        'url': null
      }
    }
    spot = {
      "id": spot.id,
      "ownerId": spot.ownerId,
      "address": spot.address,
      "city": spot.city,
      "state": spot.state,
      "country": spot.country,
      "lat": spot.lat,
      "lng": spot.lng,
      "name": spot.name,
      "description": spot.description,
      "price": spot.price,
      "createdAt": spot.createdAt,
      "updatedAt": spot.updatedAt,
      "avgRating": avgRating,
      "previewImage": previewImage.url
    }
    Spots.push(spot)
  }
  return res.json({Spots, page, size})
})

//create a spot
router.post('/', async (req, res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const userId = req.user.id
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
  const user = Spot.findByPk(userId)
  //error response validation error
  const validationError = {
    "message": "Validation Error",
    "statusCode": 400,
    "errors" : {}
  }

  if (!address){
    validationError.errors.address = 'Street address is required'
  }
  if(!city){
    validationError.errors.city = 'City is required'
  }
  if(!state){
    validationError.errors.state = "State is required"
  }
  if(!country){
    validationError.errors.country = 'Country is required'
  }
  if(!lat){
    validationError.errors.lat = 'Latitude is not valid'
  }
  if(!lng){
    validationError.errors.lng = 'Longitude is not valid'
  }
  if(!name || name.length > 50){
    validationError.errors.name = 'Name must be less than 50 characters'
  }
  if(!description){
    validationError.errors.description = 'Description is required'
  }
  if(!price){
    validationError.errors.price = 'Price per day is required'
  }

  if (validationError.errors.hasOwnProperty('address') ||validationError.errors.hasOwnProperty('city') ||validationError.errors.hasOwnProperty('state') || validationError.errors.hasOwnProperty('country')||validationError.errors.hasOwnProperty('lat') || validationError.errors.hasOwnProperty('lng') || validationError.errors.hasOwnProperty('lat') || validationError.errors.hasOwnProperty('name')|| validationError.errors.hasOwnProperty('description')||validationError.errors.hasOwnProperty('price')){
    return res.status(400).json({validationError})
  }
//end error validation

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
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
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
    if(userId !== spot.ownerId){
      return res.status(403).json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }
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

router.post('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
  const {review, stars} = req.body;

  //validation error
  const validationError = {
    "message" : "Validation error",
    "status" : 400,
    'errors' : {}
  }

  if(!review){
    validationError.errors.review = 'Review text is required'
  }
  if(!stars || stars > 5 || stars < 1){
    validationError.errors.stars = 'Stars must be an integer from 1 to 5'
  }

  if (validationError.errors.hasOwnProperty('review') || validationError.errors.hasOwnProperty('stars')){
    return res.status(400).json({validationError})
  }
  //end validation error

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

router.post('/:spotId/bookings', async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
  const {startDate, endDate} = req.body;
  const jsStartDate = new Date(startDate).toDateString()
  const jsEndDate = new Date(endDate).toDateString()
  const currentDate = new Date().toDateString()
  // const currentMonth = currentDate.month += 1

  if (currentDate > jsStartDate){
    return res.status(403).json({
      "message": "Can't create a booking for a past date",
      "statusCode": 403
    })
  }

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

router.get('/:spotId/bookings',  async (req, res) => {
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
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

  const owner = await User.findByPk(spot.ownerId)
  const images = await SpotImage.findAll({
    where: {spotId: spot.id},
    attributes: ['id', 'url', 'preview']
  })

  const result = {
    "id": spot.id,
    "ownerId": spot.ownerId,
    "address": spot.address,
    "city": spot.city,
    "state": spot.state,
    "country": spot.country,
    "lat": spot.lat,
    "lng": spot.lng,
    "name": spot.name,
    "description": spot.description,
    "price": spot.price,
    "createdAt": spot.createdAt,
    "updatedAt": spot.updatedAt ,
    "numReviews": spot.numReviews,
    "avgStarRating": spot.avgRating,
    "SpotImages": images,
    "Owner": {
      "id": owner.id,
      "firstName": owner.firstName,
      "lastName": owner.lastName
    }
  }
  return res.json(result)
})


//edit a spot

router.put('/:spotId', async (req, res) => {
  const spotId = req.params.spotId
  const userId = req.user.id
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const spot = await Spot.findByPk(spotId)

  //error response validation error
  const validationError = {
    "message": "Validation Error",
    "statusCode": 400,
    "errors" : {}
  }

  if (!address){
    validationError.errors.address = 'Street address is required'
  }
  if(!city){
    validationError.errors.city = 'City is required'
  }
  if(!state){
    validationError.errors.state = "State is required"
  }
  if(!country){
    validationError.errors.country = 'Country is required'
  }
  if(!lat){
    validationError.errors.lat = 'Latitude is not valid'
  }
  if(!lng){
    validationError.errors.lng = 'Longitude is not valid'
  }
  if(!name || name.length > 50){
    validationError.errors.name = 'Name must be less than 50 characters'
  }
  if(!description){
    validationError.errors.description = 'Description is required'
  }
  if(!price){
    validationError.errors.price = 'Price per day is required'
  }

  if (validationError.errors.hasOwnProperty('address') ||validationError.errors.hasOwnProperty('city') ||validationError.errors.hasOwnProperty('state') || validationError.errors.hasOwnProperty('country')||validationError.errors.hasOwnProperty('lat') || validationError.errors.hasOwnProperty('lng') || validationError.errors.hasOwnProperty('lat') || validationError.errors.hasOwnProperty('name')|| validationError.errors.hasOwnProperty('description')||validationError.errors.hasOwnProperty('price')){
    return res.status(400).json({validationError})
  }
//end error validation

  if(spot){
    if(spot.ownerId !== userId){
      return res.status(403).json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }
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
  const userId = req.user.id
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}

  if (spot){
    if (spot.ownerId === userId){
    await spot.destroy();
    return res.status(200).json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } else {
    return res.status(403).json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }
  } else {
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
})

module.exports = router;
