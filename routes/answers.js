var express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

var router = express.Router();

const commentValidators = [
    check("comment")
        .exists({ checkFalsy: true })
        .withMessage("Please insert a comment")
        .isLength({ max: 255 })
        .withMessage("A comment must be no longer than 255 characters long"),
];

router.get(
    "/:id(\\d+)/comments/new",
    csrfProtection,
    asyncHandler(async (req, res) => {
        if (res.locals.authenticated) {
            const answerId = parseInt(req.params.id, 10);
            const answer = await db.Answer.findByPk(answerId);
            res.render("new-comment", {
                title: "New Comment",
                answer,
                answerId,
                csrfToken: req.csrfToken(),
            });
        } else {
            res.redirect("/login");
        }
    })
);

router.post(
    "/:id(\\d+)/comments",
    csrfProtection,
    commentValidators,
    asyncHandler(async (req, res, next) => {
        const answerId = parseInt(req.params.id, 10);
        const answer = await db.Answer.findByPk(answerId);
        const { questionId } = answer;
        const { comment } = req.body;
        const userId = res.locals.user.id;

        const userComment = db.Comment.build({
            comment,
            userId,
            answerId,
        });

        const validatorErrors = validationResult(req);
        try {
            if (validatorErrors.isEmpty()) {
                await userComment.save();
                res.redirect(`/questions/${questionId}`);
            } else {
                const errors = validatorErrors
                    .array()
                    .map((error) => error.msg);
                const answer = await db.Answer.findByPk(answerId);
                res.render("new-comment", {
                    comment,
                    errors,
                    answer,
                    csrfToken: req.csrfToken(),
                });
            }
        } catch (err) {
            if (
                err.name === "SequelizeValidationError" ||
                err.name === "SequelizeUniqueConstraintError"
            ) {
                const errors = err.errors.map((error) => error.message);
                res.render("new-comment", {
                    title: "New Comment",
                    userComment,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            } else {
                next(err);
            }
        }
    })
);

//Helper Functions
/* ********************************************************************************************************************/
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
        // console.log(answer);
    }
};

const convertDate = (question) => {
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
};
const questionNotFoundError = (id) => {
    const err = Error(`Question with id of ${id} could not be found.`);
    err.title = "Question not found.";
    err.status = 404;
    return err;
};

const convertDateAnswers = (answers) => {
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
};

/* ********************************************************************************************************************/

//Validators
/* ********************************************************************************************************************/
const questionValidators = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a title")
        .isLength({ max: 50 })
        .withMessage("The title must be no longer than 50 characters long"),
    check("content")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a question")
        .isLength({ max: 255 })
        .withMessage("The question must be no longer than 255 characters long"),
];

const answerValidators = [
    check("content")
        .exists({ checkFalsy: true })
        .withMessage("Please enter an answer")
        .isLength({ max: 255 })
        .withMessage("The answer must be no longer than 255 characters long"),
];
/* ********************************************************************************************************************/
//Routes for Answers
/* ********************************************************************************************************************/

/* ********************************************************************************************************************/
//Delete Answers
/* ********************************************************************************************************************/
router.post(
    "/:id/delete",
    asyncHandler(async (req, res, next) => {
        const answerId = parseInt(req.params.id, 10);
        const answer = await db.Answer.findByPk(answerId);

        console.log(answer.questionId);
        if (answer) {
            await answer.destroy();
            res.redirect(`/questions/${answer.questionId}`);
        } else {
            next(questionNotFoundError(answerId));
        }
    })
);

/* ********************************************************************************************************************/
//Edit Answers
/* ********************************************************************************************************************/
router.get(
    "/:id/edit",
    csrfProtection,
    asyncHandler(async (req, res) => {
        const answerId = parseInt(req.params.id, 10);
        const answer = await db.Answer.findByPk(answerId);
        if (res.locals.authenticated) {
            res.render("edit-answer", {
                answer,
                csrfToken: req.csrfToken(),
            });
        } else {
            res.redirect("/login");
        }
    })
);
router.post(
    "/:id",
    csrfProtection,
    questionValidators,
    asyncHandler(async (req, res, next) => {
        const { content } = req.body;
        const answerId = parseInt(req.params.id, 10);
        const answer = await db.Answer.findByPk(answerId);
        if (answer) {
            await answer.update({ content: content });
            res.redirect(`/questions/${answer.questionId}`);
        } else {
            next(questionNotFoundError(answerId));
        }
    })
);
/* ********************************************************************************************************************/
//
/* ********************************************************************************************************************/
module.exports = router;
