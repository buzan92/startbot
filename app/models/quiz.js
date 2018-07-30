'use strict';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Quiz = new Schema(
  {
    chatid: Number,
    questions: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('quiz', Quiz);
