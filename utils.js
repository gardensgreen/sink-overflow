const { validationResult } = require("express-validator");
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((e) => e.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request.";
        return next(err);
    }

    next();
};

module.exports = { csrfProtection, asyncHandler, handleValidationErrors };
