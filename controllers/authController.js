const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsyc = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const emailSender = require('../utils/mail');

exports.signup = catchAsyc(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConf: req.body.passwordConf
  });
  const token = await User.createToken({ id: newUser._id, name: newUser.name });
  res.status(201).json({
    status: 'success',
    token,
    newUser
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'inorrect email or password' });
  }
  const token = await user.createToken({ id: user._id, name: user.name });
  return res.status(200).json({
    status: 'success',
    token
  });
};

module.exports.chechAuth = catchAsyc(async (req, res, next) => {
  // console.log('headerss', req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('please signin to access this data', 401));
  }
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // console.log(decodedData);
  const user = await User.findById(decodedData.playLoad.id);
  // console.log(user);
  if (!user) {
    return next(new AppError('the does not exis t any more', 401));
  }
  //chech if password changed
  if (user.checkPasswordDateWithToken(decodedData.iat)) {
    return next(new AppError('password has changed', 401));
  }

  req.user = user;
  next();
});

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('you have no permission', 403));
    }
    next();
  };
};
module.exports.forgotPawword = catchAsyc(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('please provide an email', 404));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there's no user with this email"));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    //sending email to the user
    const reserURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetpassword/${resetToken}`;
    const message = `the reset url is: ${reserURL}`;

    await emailSender({
      email: user.email,
      subject: 'password resetting',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'url sent to your email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("can't send an email please try again later", 500)
    );
  }
});

module.exports.resetPassword = catchAsyc(async (req, res, next) => {
  // 1- get the user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: Date.now() }
  });

  if (!user) {
    next(new AppError('the token is invaild or expired', 400));
  }
  //resetting password
  user.password = req.body.password;
  user.passwordConf = req.body.passwordConf;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;
  user.save();
  //signin
  const token = await user.createToken({ id: user._id, name: user.name });
  return res.status(200).json({
    status: 'success',
    token
  });
});

module.exports.changePassword = catchAsyc(async (req, res, next) => {
  // 1- get the user
  const user = User.findById(req.user._id).select('+password');
  // 2- check posted password
  if (
    !(req.body.password || req.body.newPassword || req.body.newPasswordConf)
  ) {
    return next(
      new AppError(
        'please provide current password and the new password and the password confirmed',
        404
      )
    );
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError('password invalid', 400));
  }
  // change password
  user.password = req.body.newPassword;
  user.passwordConf = req.body.newPasswordConf;
  user.save();
  //log in the user
  const token = await user.createToken({ id: user._id, name: user.name });
  return res.status(200).json({
    status: 'success',
    token
  });
});
