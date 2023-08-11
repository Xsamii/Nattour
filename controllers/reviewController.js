const catchAsync = require('../utils/catchAsync');

const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('./deleteOne');

module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  try {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;
    const reviewList = await Review.find(filter);
    res.status(200).json({
      status: 'success',
      length: reviewList.length,
      data: reviewList
    });
  } catch (err) {
    next(new AppError(err, 400));
  }
});

module.exports.addReview = catchAsync(async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    req.body.user = req.user._id;
    const newReview = await Review.create(req.body);
    res.status(201);
    res.json({
      status: 'success',
      data: newReview
    });
  } catch (err) {
    next(new AppError(err, 400));
  }
});

module.exports.deleteReview = factory.deleteOne(Review);
