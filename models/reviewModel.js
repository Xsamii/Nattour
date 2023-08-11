const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'every review must have a review'],
      minlength: 8
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'every review must have a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'every review must have a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate({ path: 'user', select: 'name' }).populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  this.populate({ path: 'user', select: 'name' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
