const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyc = require('../utils/catchAsync');
const factory = require('./deleteOne');

const filterUpdateBody = body => {
  const allowableFields = ['name', 'email'];
  const filteredObject = {};
  Object.keys(body).forEach(key => {
    if (allowableFields.includes(key)) {
      filteredObject[key] = body[key];
    }
  });
  return filteredObject;
};
exports.getAllUsers = async (req, res) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: 'success',
    users: allUsers
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = catchAsyc(async (req, res, next) => {
  const filteredObj = filterUpdateBody(req.body);
  try {
    console.log('iam here');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      user: updatedUser
    });
  } catch (err) {
    next(new AppError("couldn't update user", err.status));
  }
});
exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { inActive: true });

  res.status(204).json({
    status: 'success',
    message: 'user was deleted'
  });
};
exports.deleteUser = factory.deleteOne(User);
