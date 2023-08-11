const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    duration: {
      type: Number,
      required: [true, 'must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      required: true
      // enum: ['easy','mediunm','hard']
    },
    priceDiscount: {
      type: Number
    },
    summary: {
      type: String,
      trim: true
    },
    ratingAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: false,
      default: 4.5
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: true
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // to hide this field shen selecting from database
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      corrdinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        corrdinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // guides:Array
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//for embded relation
// tourSchema.pre('save',async function(next){
//   const guidePromises = this.guides.map(async id => User.findById(id) );
//   this.guides = await Promise.all(guidePromises);

//   next();
// })

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
