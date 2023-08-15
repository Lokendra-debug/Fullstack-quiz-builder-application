const mongoose = require('mongoose')

const questionSchema =  mongoose.Schema({
    title: { type: String, required: true },
    answerOptions: { type: [String], required: true },
    correctOptions: { type: [Number], required: true },
});
  
  
const leaderboardSchema =  mongoose.Schema({
    email: { type: String, required: true },
    score: { type: Number, required: true },
});
  
  
const quizSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    leaderboard : {type:[leaderboardSchema], required : true}
});
  
const Quiz = mongoose.model('Quiz', quizSchema);
  
module.exports = {Quiz};
