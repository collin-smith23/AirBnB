const express = require('express');
const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check } = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const validateReview = [
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
  return res.json({
    reviews
  })
});


//add an image to a review

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId
  const userId = req.user.id;
  const {url} = req.body;

  const isReview = await Review.findByPk(reviewId)
  const reviewImages = await ReviewImage.findAll({
    where: {reviewId}
  })

  if(!isReview){
    return res.status(404).json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }

  if(reviewImages.length >= 10){
    return res.status(403).json({
        "message": "Maximum number of images for this resource was reached",
        "statusCode": 403
    })
  }

  if (isReview){
    const addImage = await ReviewImage.create({
      url,
      reviewId
    })
    return res.json({
      "id": addImage.id,
      url
    })
  }
})

//edit a review

router.put('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId
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

  const isReview = await Review.findByPk(reviewId);

  if(!isReview){
    return res.status(404).json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }else {
    isReview.update({
      review,
      stars
    })
    return res.status(200).json(isReview)
  }
})

//delete a review

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId);

  if (review){
    await review.destroy();
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  } else {
    return res.status(404).json({
      "message": "Review couldn't be found",
      "statusCode": 404
    })
  }
})


module.exports = router
