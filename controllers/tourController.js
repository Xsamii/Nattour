// const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyc = require('../utils/catchAsync');
const factory = require('./deleteOne');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 201,
      data: newTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'Bad Request',
      message: err
    });
  }
};
exports.aliasQueryTop5 = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,description,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // queries and filtering
    // const queryObject = { ...req.query };
    // const execludedFields = ['page', 'limit', 'sort', 'fields'];
    // execludedFields.forEach(el => delete queryObject[el]);
    // console.log(queryObject);
    // let queryStr = JSON.stringify(queryObject);
    // queryStr = queryStr.replace(/\b(?:gt|gte|lt|lte)\b/, match => `$${match}`);
    // console.log(queryStr);
    // let query = Tour.find(JSON.parse(queryStr)); //this method retun a query not data
    //sorting
    // if (req.query.sort) {
    //   const sortString = req.query.sort.split(',').join(' ');
    //   query.sort(sortString);
    // } else {
    //   query.sort('-createdAt');
    // }
    // choosing fields
    // if (req.query.fields) {
    //   const limitString = req.query.fields.split(',').join(' ');
    //   query.select(limitString);
    // } else {
    //   query.select('-__v');
    // }
    //paggination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // console.log(`page:${page},limit${limit}`);
    // const skip = (page - 1) * limit;
    // query.skip(skip).limit(limit);
    // if (req.query.page && skip >= (await Tour.countDocuments())) {
    //   throw new Error('page not found');
    // }
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagginate();
    //executing query
    const tours = await features.query;
    res.status(200).json({
      status: 'succeed',
      length: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    });
  }
};

exports.getTour = catchAsyc(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
    .populate('guides')
    .populate('reviews');
  // console.log('iam here');
  if (!tour) {
    return next(new AppError("id doesn't exist", 404));
  }
  res.status(200).json({
    status: 'succeed',
    data: {
      tour
    }
  });
});

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'succeeded',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      err
    });
  }
};

// exports.deleteTour = catchAsyc(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('no document found with this id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);
