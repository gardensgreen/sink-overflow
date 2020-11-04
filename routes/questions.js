var express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

var router = express.Router();

const questionValidators = [
    check("title")
        .exists({ checkFalsy: true})
        .withMessage("Please enter a title")
        .isLength({max: 50})
        .withMessage("The title must be no longer than 50 characters long"),
    check("content")
        .exists({ checkFalsy: true})
        .withMessage("Please enter a question")
        .isLength({max: 255})
        .withMessage("The question must be no longer than 255 characters long")
]

router.get('/new', csrfProtection, asyncHandler(async (req, res,) => {
    if(res.locals.authenticated){
        res.render("new-question", { title: "New Question", csrfToken : req.csrfToken()})
    } else {
        res.redirect('/login');
    }
}))

router.post('/', csrfProtection, questionValidators, asyncHandler(async (req, res, next) => {
    const {title, content} = req.body
    const userId = res.locals.user.id;

    const question = db.Question.build({
        title,
        content,
        userId
    });

    // console.log(title);
    const validatorErrors = validationResult(req);
try{
    if(validatorErrors.isEmpty()){
        await question.save()
        res.redirect('/')
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('new-question', {
            title : title,
            content,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
} catch (err){
    if (err.name === "SequelizeValidationError" ||
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
}));



module.exports = router;


