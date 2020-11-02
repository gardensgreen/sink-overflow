var express = require("express");
const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

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
//Routes

//User Registration
/* ************************************************************************************** */
router.get("/register", csrfProtection, (req, res) => {
    const user = db.User.build();
    res.render("register", {
        title: "Register",
        user,
        csrfToken: req.csrfToken(),
    });
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
                res.redirect("/");
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
    res.render("login", {
        csrfToken: req.csrfToken(),
    });
});

router.post("/login", csrfProtection, loginValidators, asyncHandler(async (req, res) => {

  const {email, }




}));


module.exports = router;
