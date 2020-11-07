var express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Answer, Comment, Question, User, Vote, sequelize } = db;
const { loginUser, logoutUser } = require("../auth");
//const {addVoteCount,addAnswerCount,convertDate} = require("./index")

var router = express.Router();

/* GET users listing. */

//Validators
const userValidators = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for First Name")
        .isLength({ max: 50 })
        .withMessage("First Name must not be more than 50 characters long"),
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Email Address")
        .isLength({ max: 255 })
        .withMessage("Email Address must not be more than 255 characters long")
        .isEmail()
        .withMessage("Email Address is not a valid email")
        .custom((value) => {
            return db.User.findOne({ where: { email: value } }).then((user) => {
                if (user) {
                    return Promise.reject(
                        "The provided Email Address is already in use by another account"
                    );
                }
            });
        }),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Password")
        .isLength({ max: 50 })
        .withMessage("Password must not be more than 50 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
        .withMessage(
            'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
        ),
    check("confirmPassword")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Confirm Password")
        .isLength({ max: 50 })
        .withMessage(
            "Confirm Password must not be more than 50 characters long"
        )
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm Password does not match Password");
            }
            return true;
        }),
];

const loginValidators = [
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Email Address"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Password"),
];

// helperFunctions

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
//Routes

//User Registration
/* ************************************************************************************** */
router.get("/register", csrfProtection, (req, res) => {
    if (!res.locals.authenticated) {
        const user = db.User.build();
        res.render("register", {
            title: "Register",
            user,
            csrfToken: req.csrfToken(),
        });
    } else {
        res.redirect("/");
    }
});

router.post(
    "/register",
    csrfProtection,
    userValidators,
    asyncHandler(async (req, res, next) => {
        const { email, username, password } = req.body;

        const user = db.User.build({
            email,
            username,
        });

        const validatorErrors = validationResult(req);
        try {
            if (validatorErrors.isEmpty()) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.hashedPassword = hashedPassword;
                await user.save();
                loginUser(req, res, user);
                return req.session.save((err) => {
                    if (!err) {
                        console.log("no error");
                        return res.redirect("/");
                    } else {
                        console.log(err);
                        next(err);
                    }
                });
            } else {
                const errors = validatorErrors
                    .array()
                    .map((error) => error.msg);
                res.render("register", {
                    title: "Register",
                    user,
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
                res.render("register", {
                    title: "Register",
                    user,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            } else {
                next(err);
            }
        }
    })
);
/* ************************************************************************************** */
//User Login
/* ************************************************************************************** */
router.get("/login", csrfProtection, (req, res) => {
    if (!res.locals.authenticated) {
        res.render("login", {
            csrfToken: req.csrfToken(),
        });
    } else {
        res.redirect("/");
    }
});

router.post(
    "/login",
    csrfProtection,
    loginValidators,
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        let errors = [];

        const validatorErrors = validationResult(req);

        if (validatorErrors.isEmpty()) {
            const user = await db.User.findOne({
                where: { email },
            });

            if (user !== null) {
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.hashedPassword.toString()
                );

                if (passwordMatch) {
                    loginUser(req, res, user);
                    return req.session.save((err) => {
                        if (!err) {
                            console.log("no error");
                            return res.redirect("/");
                        } else {
                            console.log(err);
                            next(err);
                        }
                    });
                }
            }

            errors.push(
                "Login failed for the provided email address and password"
            );
        } else {
            errors = validatorErrors.array().map((e) => e.msg);
        }

        res.render("login", {
            title: "Login",
            email,
            errors,
            csrfToken: req.csrfToken(),
        });
    })
);
/* ************************************************************************************** */
// User Logout
/* ************************************************************************************** */
router.post("/logout", (req, res, next) => {
    logoutUser(req);
    return req.session.save((err) => {
        if (!err) {
            return res.redirect("/");
        } else {
            next(err);
        }
    });
});
/* ************************************************************************************** */
// Demo User
/* ************************************************************************************** */
router.get(
    "/demo",
    asyncHandler(async (req, res, next) => {
        const demoUser = await db.User.findOne({
            where: { email: "demo@demo.com" },
        });
        loginUser(req, res, demoUser);
        return res.redirect("/");
    })
);
/* ************************************************************************************** */
// My Questions
/* ************************************************************************************** */
router.get(
    "/users/:id/questions",
    asyncHandler(async (req, res) => {
        if (!res.locals.authenticated) {
            return res.redirect("/login");
        } else if (parseInt(req.params.id, 10) !== res.locals.user.id) {
            res.redirect("/");
        } else {
            const questions = await db.Question.findAll({
                where: { userId: res.locals.user.id },
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
                attributes: ["title", "content", "createdAt", "id"],
                group: ["Question.id", "User.id", "Votes.id", "Answers.id"],
            });
            addVoteCount(questions);
            addAnswerCount(questions);
            convertDate(questions);
            if (res.locals.authenticated) {
                await didIVote(questions, res);
            }
            res.render("myQuestion", { questions });
        }
    })
);

/* ************************************************************************************** */
// My Answers
/* ************************************************************************************** */

router.get(
    "/users/:id/answers",
    asyncHandler(async (req, res) => {
        if (!res.locals.authenticated) {
            return res.redirect("/login");
        } else if (parseInt(req.params.id, 10) !== res.locals.user.id) {
            res.redirect("/");
        } else {
            const questions = await db.Question.findAll({
                include: [
                    { model: User, as: "User", attributes: ["username"] },
                    { model: Vote, as: "Votes", attributes: ["isDownvote"] },
                    {
                        model: Answer,
                        as: "Answers",
                        attributes: [
                            [Answer.sequelize.fn("COUNT", "id"), "answerCount"],
                            "userId",
                        ],
                        where: { userId: res.locals.user.id },
                    },
                ],
                order: [["createdAt", "DESC"]],
                attributes: ["title", "content", "createdAt", "id"],
                group: ["Question.id", "User.id", "Votes.id", "Answers.id"],
            });
            addVoteCount(questions);
            addAnswerCount(questions);
            convertDate(questions);

            if (res.locals.authenticated) {
                await didIVote(questions, res);
            }
            res.render("myQuestion", { questions });
        }
    })
);

module.exports = router;
