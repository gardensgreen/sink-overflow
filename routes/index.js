var express = require("express");
var router = express.Router();

const db = require("../db/models");
const { Answer, Comment, Question, User, Vote, sequelize } = db;
const { asyncHandler, csrfProtection } = require("../utils");

//Helper Functions
const trimContent = (questions) => {
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        let content = question.content;

        let trimmed;
        if (content.length > 140) {
            trimmed = content.substring(0, 140);
        } else {
            trimmed = content;
        }
        question.trimmedContent = trimmed + "...";
    }
};

const didIVote = async (questions, res) => {
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];

        const vote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                questionId: question.id,
            },
        });

        if (vote) {
            if (vote.isDownvote) {
                question.userDownVote = true;
                question.userUpVote = false;
            } else {
                question.userDownVote = false;
                question.userUpVote = true;
            }
        } else {
            question.userDownVote = false;
            question.userUpVote = false;
        }
    }
};

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

const addQuestionLink = (questions) => {
    for (let i = 0; i < questions.length; i++) {
        questions[i].link = "/questions/" + questions[i].id;
    }
};

/* GET home page. */
function convertDate(questions) {
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
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        let createdAt = question.createdAt.toString();
        let parts = createdAt.split(" ");
        question.formattedDate =
            months[parts[1]] + "/" + parts[2] + "/" + parts[3];
    }
}

router.get(
    "/",
    csrfProtection,
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
            attributes: ["id", "title", "content", "createdAt"],
            group: ["Question.id", "User.id", "Votes.id", "Answers.id"],
        });

        addVoteCount(questions);
        addAnswerCount(questions);
        convertDate(questions);
        trimContent(questions);
        addQuestionLink(questions);

        if (res.locals.authenticated) {
            await didIVote(questions, res);
        }

        // console.log(questions);
        res.render("index", { questions, csrfToken: req.csrfToken() });
    })
);

module.exports = router;
