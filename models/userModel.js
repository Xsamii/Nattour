const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'email must be usique'],
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email']
  },

  photo: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConf: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      // only works on create and save;
      validator: function(el) {
        return el === this.password;
      },
      message: 'passwords nust be the same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'admin'
  },
  passwordResetToken: String,
  passwordResetTokenExpiration: Date,
  inActive:{
    type:Boolean,
    select:false,
    default:false
  }
});

userSchema.methods.checkPasswordDateWithToken = function(jwtIAtDate) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtIAtDate < changedTimestamp;
  }
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConf = undefined;
});
userSchema.pre(/^find/,function(next){
  this.find({inActive:false});
  next();
});

userSchema.methods.createToken = async playLoad => {
  return jwt.sign({ playLoad }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 100;
  return resetToken;
};
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
