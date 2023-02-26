const express = require('express');
const { setTokenCookie, requireAuth} = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();
const { check } = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');

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
router.get('/current',  async (req, res) => {
  const userId = req.user.id;

  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}

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
  // let previewImage;
  let Reviews = [];
  for (let review of reviews){
    let previewImage = await SpotImage.findOne({
      where: {
        spotId: review.Spot.id,
      },
      attributes: ['url']
    })
    if (!previewImage){
      previewImage = {}
      previewImage.url = null
    }

      review = {
        "id": review.id,
        "userId": review.userId,
        "spotId": review.spotId,
        "review": review.review,
        "stars": review.stars,
        "createdAt": review.createdAt,
        "updatedAt": review.updatedAt ,
        "User": review.User,
        "Spot": {
          "id": review.Spot.id,
          "ownerId": review.Spot.ownerId,
          "address": review.Spot.address,
          "city": review.Spot.city,
          "state": review.Spot.state,
          "country": review.Spot.country,
          "lat": review.Spot.lat,
          "lng": review.Spot.lng,
          "name": review.Spot.name,
          "price": review.Spot.price,
          "previewImage": previewImage.url
        },
        "ReviewImages": review.ReviewImage
      }
      Reviews.push(review)
  }


  return res.json({
    Reviews
  })
});


//add an image to a review

router.post('/:reviewId/images', async (req, res) => {
  const reviewId = req.params.reviewId
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
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

  if(userId !== isReview.userId){
    return res.status(403).json({
      "message": "Forbidden",
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

router.put('/:reviewId', async (req, res) => {
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
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
    if(userId !== isReview.userId){
      return res.status(403).json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }
    isReview.update({
      review,
      stars
    })
    return res.status(200).json(isReview)
  }
})

//delete a review

router.delete('/:reviewId', async (req, res) => {
  const userId = req.user.id;
  if(!userId){
    return res.status(401).json({
    "message": "Authentication required",
    "statusCode": 401
  })
}
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId);

  if (review){
    if(userId !== review.userId){
      return res.status(403).json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }
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
