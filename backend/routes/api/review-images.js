const express = require('express');

const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models')
const { check } = require('express-validator');
const { Sequelize, ValidationError } = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');
const reviewimage = require('../../db/models/reviewimage');

const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const imageId = req.params.imageId
  const image = await ReviewImage.findByPk(imageId, {
    include:
      Review
  });

  if(!image){
    return res.status(404).json({
      "message": "Review Image couldn't be found",
      "statusCode": 404
    })
  }

  if(image.Review.userId === userId){
    await image.destroy();
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  }else{
    return res.status(403).json({
      "message": "Invalid authorization to delete spot image"
    })
  }

})

module.exports = router
