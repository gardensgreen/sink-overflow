var express = require('express');
var router = express.Router();
const csurf = require('csurf');

const db = require('../db/models');
const { Answer, Comment, Question, User, Vote, sequelize } = db
const { asyncHandler } = require('../utils');




/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const questions = await Question.findAll({
    include: [
      { model: User, as: 'User', attributes: ["username"] },
      { model: Vote, as: 'Votes', attributes: ["isDownvote"] },
      { model: Answer, as: 'Answers', attributes: [ [Answer.sequelize.fn('COUNT', 'id'), 'answerCount']]} 
    ],
    order: [["createdAt", "DESC"]],
    attributes: ["title", "content", "createdAt"],
    group: ["Question.id", "User.id", "Votes.id", "Answers.id"]
  });

  for(let i = 0; i < questions.length; i++){
    let voteCount = 0
    for(let vote in questions[i].votes){
      if(vote.isDownvote){
        voteCount--
      } else {
        voteCount++
      }
    }
    questions[i].voteCount = voteCount;
  }

  for(let i = 0; i < questions.length; i++){
    let answerCounts = 0
    for(let answer in questions[i].answers){
      if(answer.answerCount){
        answerCounts++
      } else {
        answerCounts--
      }
    }
    questions[i].answerCounts = answerCounts
  }

  // for(let i = 0; i < questions.length; i++){
  //   let answerCount = 0;
  //   for(let answer in questions[i].answers){
      
  //   }
  // }



  console.log(questions);
  // console.log(questions[0].answerCount);
  // console.log(questions[0].Votes[0].isDownvote);
  // console.log(questions[0].Votes);
  // console.log(questions.Votes[0]);
  // console.log(questions.Vote);
  // res.render('index', { title: 'a/A Express Skeleton Home' });
  res.render('index', { questions });
}));



module.exports = router;
