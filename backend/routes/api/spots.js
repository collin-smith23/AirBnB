const express = require('express');

const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, SpotImage, Review} = require('../../db/models')
const { check } = require('express-validator');
const { Sequelize } = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');

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
