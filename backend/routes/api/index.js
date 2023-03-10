const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings')
const reviewImagesRouter = require('./review-images');
const spotImagesRouter = require('./spot-images')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter)

router.use('/bookings', bookingsRouter)

router.use('/review-images', reviewImagesRouter);

router.use('/spot-images', spotImagesRouter)

router.post('/test', function(req, res) {
  res.json({ requestBody: req.body})
})


module.exports = router;
