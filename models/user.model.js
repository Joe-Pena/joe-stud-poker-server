const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  hands: {type: Object, default: {
    royalFlush: 0,
    straightFlush: 0,
    fourOfAKind: 0,
    fullHouse: 0,
    flush: 0,
    straight: 0,
    threeOfAKind: 0,
    twoPair: 0,
    pair: 0,
    totalHands: 0,
  }},
  chips: {type: Number, default: 2000},
  hiStake: {type: Number, default: 0},
  hiWin: {type: Number, default: 0},
});

userSchema.methods.serialize = function() {
  return({
    id: this._id,
    username: this.username,
    email: this.email,
    hands: this.hands,
    chips: this.chips,
    hiStake: this.hiStake,
    hiWin: this.hiWin,
  });
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const userJoiSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(4).max(16).trim().required(),
  password: Joi.string().min(8).max(72).trim().required(),
  email: Joi.string().email().trim().required(),
});

const User = mongoose.model('User', userSchema);

module.exports = {User, userJoiSchema}