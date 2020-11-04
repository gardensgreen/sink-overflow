var express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { loginUser, logoutUser } = require("../auth");

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
router.get('/demo', asyncHandler(async (req, res, next) => {
    const demoUser = await db.User.findOne({
            where: {email: 'demo@demo.com'}
    })
    loginUser(req, res, demoUser)
    return res.redirect("/")
}))
module.exports = router;
