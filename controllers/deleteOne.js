const catchAsyc = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.deleteOne = model =>
  catchAsyc(async (req, res, next) => {
    const tour = await model.findByIdAndDelete(req.params.id);
    if (!tour) {
      return next(new AppError('no document found with this id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
