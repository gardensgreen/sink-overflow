var express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

var router = express.Router();

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

const didIVoteQuestion = async (question, res) => {
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
};

const didIVoteAnswers = async (answers, res) => {
    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];

        const vote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                answerId: answer.id,
            },
        });

        if (vote) {
            if (vote.isDownvote) {
                answer.userDownVote = true;
                answer.userUpVote = false;
            } else {
                answer.userDownVote = false;
                answer.userUpVote = true;
            }
        } else {
            answer.userDownVote = false;
            answer.userUpVote = false;
        }
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

//Routes
/* ********************************************************************************************************************/

//Get new question form
/* ********************************************************************************************************************/
router.get(
    "/new",
    csrfProtection,
    asyncHandler(async (req, res) => {
        if (res.locals.authenticated) {
            res.render("new-question", {
                title: "New Question",
                csrfToken: req.csrfToken(),
            });
        } else {
            res.redirect("/login");
        }
    })
);
/* ********************************************************************************************************************/

//Create new question
/* ********************************************************************************************************************/
router.post(
    "/",
    csrfProtection,
    questionValidators,
    asyncHandler(async (req, res, next) => {
        const { title, content } = req.body;
        const userId = res.locals.user.id;

        const question = db.Question.build({
            title,
            content,
            userId,
        });

        // console.log(title);
        const validatorErrors = validationResult(req);
        try {
            if (validatorErrors.isEmpty()) {
                await question.save();
                res.redirect("/");
            } else {
                const errors = validatorErrors
                    .array()
                    .map((error) => error.msg);
                res.render("new-question", {
                    title: title,
                    content,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            }
        } catch (err) {
            if (
                err.name === "SequelizeValidationError" ||
                err.name === "SequelizeUniqueConstraintError"
            ) {
                const errors = err.errors.map((error) => error.message);
                res.render("new-question", {
                    title: "New Question",
                    question,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            } else {
                next(err);
            }
        }
    })
);
/* ********************************************************************************************************************/

//Question Details
/* ********************************************************************************************************************/
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
                    include: [{ model: db.Vote }, { model: db.Comment }],
                    order: [["createdAt"]],
                },
            ],
        });

        addAnswerCount(question);
        addVoteCountQuestion(question);
        convertDate(question);
        addVoteCountAnswers(question.Answers);
        convertDateAnswers(question.Answers);
        await addAnswerAuthor(question.Answers);

        if (res.locals.authenticated) {
            await didIVoteQuestion(question, res);
            await didIVoteAnswers(question.Answers, res);
        }

        // console.log(question);

        res.render("question-detail", { question });
    })
);
/* ********************************************************************************************************************/
// Delete Question
/* ********************************************************************************************************************/

router.post(
    "/:id/delete",
    asyncHandler(async (req, res, next) => {
        const questionId = parseInt(req.params.id, 10);
        const question = await db.Question.findByPk(questionId);

        if (question) {
            await question.destroy();
            res.redirect("/");
        } else {
            next(questionNotFoundError(questionId));
        }
    })
);
/* ********************************************************************************************************************/
// Edit Question
/* ********************************************************************************************************************/
router.get(
    "/:id/edit",
    csrfProtection,
    asyncHandler(async (req, res) => {
        const questionId = parseInt(req.params.id, 10);
        const question = await db.Question.findByPk(questionId);
        console.log(question);
        if (res.locals.authenticated) {
            res.render("edit-question", {
                question,
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
        const { title, content } = req.body;
        const userId = res.locals.user.id;
        const questionId = parseInt(req.params.id, 10);

        const question = await db.Question.findByPk(questionId);
        if (question) {
            await question.update({ title: title, content: content });
            res.redirect(`/questions/${question.id}`);
        } else {
            next(questionNotFoundError(questionId));
        }
    })
);

//Get Answer form for question
router.get(
    "/:id(\\d+)/answers/new",
    csrfProtection,
    asyncHandler(async (req, res) => {
        if (res.locals.authenticated) {
            const questionId = parseInt(req.params.id, 10);
            const question = await db.Question.findByPk(questionId);
            res.render("new-answer", {
                question,
                csrfToken: req.csrfToken(),
            });
        } else {
            res.redirect("/login");
        }
    })
);

//Create an answer that is associated to the question
router.post(
    "/:id(\\d+)/answers",
    csrfProtection,
    answerValidators,
    asyncHandler(async (req, res, next) => {
        const questionId = parseInt(req.params.id, 10);
        const { content } = req.body;
        const userId = res.locals.user.id;

        const answer = db.Answer.build({
            content,
            userId,
            questionId,
        });

        // console.log(title);
        const validatorErrors = validationResult(req);
        try {
            if (validatorErrors.isEmpty()) {
                await answer.save();
                res.redirect(`/questions/${questionId}`);
            } else {
                const errors = validatorErrors
                    .array()
                    .map((error) => error.msg);
                const question = await db.Question.findByPk(questionId);
                res.render("new-answer", {
                    content,
                    errors,
                    question,
                    csrfToken: req.csrfToken(),
                });
            }
        } catch (err) {
            if (
                err.name === "SequelizeValidationError" ||
                err.name === "SequelizeUniqueConstraintError"
            ) {
                const errors = err.errors.map((error) => error.message);
                res.render("new-answer", {
                    title: "New Answer",
                    question,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            } else {
                next(err);
            }
        }
    })
);

module.exports = router;
