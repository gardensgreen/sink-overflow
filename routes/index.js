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
/* GET home page. */
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
        // console.log(questions);
        res.render("index", { questions });
    })
);

module.exports = router;
