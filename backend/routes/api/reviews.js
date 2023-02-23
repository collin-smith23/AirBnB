const express = require('express');
const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check } = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const validateReview = [
  handleValidationErrors
]

//Get all reviews of current user
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: {userId},
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]

  })
});



module.exports = router
