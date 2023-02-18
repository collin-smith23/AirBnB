const express = require('express');

const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, SpotImage, Review, sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get spots of a Current User
router.get('/current', async (req, res) => {
  const userId = req.user.id
  const spots = await Spot.findAll({
    where: {ownerId:userId}
  })
  return res.json(spots)
})

//get all spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({
  });
  return res.json({"Spots": allSpots})
})

//create a spot
router.post('/', async (req, res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body
  const userId = req.user.id
  const user = Spot.findByPk(userId)

  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price){
    return res.status(400).json({
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "address": "Street address is required",
        "city": "City is required",
        "state": "State is required",
        "country": "Country is required",
        "lat": "Latitude is not valid",
        "lng": "Longitude is not valid",
        "name": "Name must be less than 50 characters",
        "description": "Description is required",
        "price": "Price per day is required"
      }
    })
  }

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
  if (spot.dataValues.id === null) {
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  if (spot){
    // console.log('this is my spot', spot)
    const newSpotImg = await SpotImage.create({
      spotId: parseInt(spot),
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

router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
  const details = await Spot.findAll({
    where: {id:spotId}
  }
  )
  return res.json({details})
})

module.exports = router;
