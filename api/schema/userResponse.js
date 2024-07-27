const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userResponseSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    responses: [{
      question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      selected_option: { type: String, required: true },
      is_correct: { type: Boolean, required: true }
    }],
    score: { type: Number, required: true }
});

const UserResponse = mongoose.model('UserResponse', userResponseSchema);

module.exports = UserResponse
