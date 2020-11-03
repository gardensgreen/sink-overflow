var express = require('express');
var router = express.Router();
const csurf = require('csurf');

const db = require('../db/models');
const { Answer, Comment, Question, User, Vote } = db
const { asyncHandler } = require('../utils');



/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const questions = await Question.findAll({
    include: [
      { model: User, as: 'User', attributes: ["username"] },
      { model: Vote, as: 'Votes', attributes: ["isDownvote"] },
      // { model: Answer, as: 'answers', attributes: ["count(*)"]} 
    ],
    order: [["createdAt", "DESC"]],
    attributes: ["title", "content", "createdAt"]
  });
  // console.log(questions);
  console.log(questions[0].Votes[0].isDownvote);
  // console.log(questions[0].Votes);
  // console.log(questions.Votes[0]);
  // console.log(questions.Vote);
  // res.render('index', { title: 'a/A Express Skeleton Home' });
  res.render('index', { questions });
}));



module.exports = router;
