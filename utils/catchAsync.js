const catchAsyc = asyncFun => {
  return (req, res, next) => {
    asyncFun(req, res, next).catch(next);
  };
};

module.exports = catchAsyc;
