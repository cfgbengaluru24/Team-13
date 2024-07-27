const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question_text: { type: String, required: true },
        options: [{ type: String, required: true }],
        correct_option: { type: String, required: true }
      }
    ]
  });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;