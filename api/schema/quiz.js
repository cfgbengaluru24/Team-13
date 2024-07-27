const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: String, required: true }
      }
    ]
  });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;