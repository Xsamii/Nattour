const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
// router.param('id', tourController.checkID);
router
  .route('/top5')
  .get(
    authController.chechAuth,
    tourController.aliasQueryTop5,
    tourController.getAllTours
  );

router
  .route('/')
  .get(authController.chechAuth, tourController.getAllTours)
  .post(
    authController.chechAuth,
    authController.restrictTo('admin'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(
    authController.chechAuth,
    authController.restrictTo('admin'),
    tourController.getTour
  )
  .patch(
    authController.chechAuth,
    authController.restrictTo('admin'),
    tourController.updateTour
  )
  .delete(
    authController.chechAuth,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;
