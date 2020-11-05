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
]

router.get(
  "/:id(\\d+)/comments/new", 
  csrfProtection,
  asyncHandler(async (req, res) => {
    if(res.locals.authenticated){
      const answerId = parseInt(req.params.id, 10);
      const answer = await db.Answer.findByPk(answerId)
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

router.post('/:id(\\d+)/comments', 
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
      answerId
    });

    const validatorErrors = validationResult(req);
    try{
      if(validatorErrors.isEmpty()) {
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
        ){
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


module.exports = router;
