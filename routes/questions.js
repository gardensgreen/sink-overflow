var express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

var router = express.Router();

const addVoteCountQuestion = (question) => {
    let voteCount = 0;
    for (let j = 0; j < question.Votes.length; j++) {
        let vote = question.Votes[j];
        if (vote.isDownvote) {
            voteCount--;
        } else {
            voteCount++;
        }
    }
    question.voteCount = voteCount;
};

const addVoteCountAnswers = async (answers) => {
    for (let i = 0; i < answers.length; i++) {
        let voteCount = 0;
        let answer = answers[i];
        for (let j = 0; j < answer.Votes.length; j++) {
            let vote = answer.Votes[j];
            if (vote.isDownvote) {
                voteCount--;
            } else {
                voteCount++;
            }
        }
        answer.voteCount = voteCount;
    }
};

const addAnswerCount = (question) => {
    let answerCount = 0;
    for (let j = 0; j < question.Answers.length; j++) {
        answerCount++;
    }
    question.answerCount = answerCount;
};

const addAnswerAuthor = async (answers) => {
    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        const user = await db.User.findByPk(answer.userId);

        const author = user.username;
        answer.author = author;
        console.log(answer);
    }
};

function convertDate(question) {
    let months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
    };

    let createdAt = question.createdAt.toString();
    let parts = createdAt.split(" ");
    question.formattedDate = months[parts[1]] + "/" + parts[2] + "/" + parts[3];
}

function convertDateAnswers(answers) {
    let months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
    };
    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        let createdAt = answer.createdAt.toString();
        let parts = createdAt.split(" ");
        answer.formattedDate =
            months[parts[1]] + "/" + parts[2] + "/" + parts[3];
    }
}

router.get(
    "/:id(\\d+)",
    asyncHandler(async (req, res) => {
        const questionId = parseInt(req.params.id, 10);
        const question = await db.Question.findByPk(questionId, {
            include: [
                { model: db.User, as: "User", attributes: ["username"] },
                { model: db.Vote, as: "Votes", attributes: ["isDownvote"] },
                {
                    model: db.Answer,
                    as: "Answers",
                    include: { model: db.Vote },
                },
            ],
        });

        addAnswerCount(question);
        addVoteCountQuestion(question);
        convertDate(question);
        addVoteCountAnswers(question.Answers);
        convertDateAnswers(question.Answers);
        await addAnswerAuthor(question.Answers);

        // console.log(question);

        res.render("question-detail", { question });
    })
);

module.exports = router;
