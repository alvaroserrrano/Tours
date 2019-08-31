const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//Access to params in another route -->mergeParams: true
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
