'use strict';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = new Schema(
  {
    chatid: Number,
    languagecode: { type: String, trim: true },
    isbot: Boolean,
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    username: { type: String, trim: true },
    state: { type: String, trim: true }, // start, quiz, finish
    callbackData: { type: String, trim: true },
    questionIdx: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('user', User);
