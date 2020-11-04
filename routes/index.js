var express = require("express");
var router = express.Router();
const csurf = require("csurf");

const db = require("../db/models");
const { Answer, Comment, Question, User, Vote, sequelize } = db;
const { asyncHandler } = require("../utils");

//Helper Functions
const addVoteCount = (questions) => {
    for (let i = 0; i < questions.length; i++) {
        let voteCount = 0;
        let question = questions[i];
        for (let j = 0; j < question.Votes.length; j++) {
            let vote = question.Votes[j];
            if (vote.isDownvote) {
                voteCount--;
            } else {
                voteCount++;
            }
        }
        question.voteCount = voteCount;
    }
};

const addAnswerCount = (questions) => {
    for (let i = 0; i < questions.length; i++) {
        let answerCount = 0;
        let question = questions[i];
        for (let j = 0; j < question.Answers.length; j++) {
            answerCount++;
        }
        question.answerCount = answerCount;
    }
};
/* GET home page. */
function convertDate(d){
 var parts = d.split(" ");
 var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
 return parts[3]+"/"+months[parts[1]]+"/"+parts[2];
}

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const questions = await Question.findAll({
            include: [
                { model: User, as: "User", attributes: ["username"] },
                { model: Vote, as: "Votes", attributes: ["isDownvote"] },
                {
                    model: Answer,
                    as: "Answers",
                    attributes: [
                        [Answer.sequelize.fn("COUNT", "id"), "answerCount"],
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
            attributes: ["title", "content", "createdAt"],
            group: ["Question.id", "User.id", "Votes.id", "Answers.id"],
        });

        addVoteCount(questions);
        addAnswerCount(questions);
        // console.log(questions);
        res.render("index", { questions });
    })
);

module.exports = router;
