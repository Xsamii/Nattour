const express = require('express');
const { chechAuth } = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(chechAuth, reviewController.addReview);

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
