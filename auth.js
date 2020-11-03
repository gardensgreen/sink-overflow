const db = require("./db/models");

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
};

const restoreUser = async (req, res, next) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await db.User.findByPk(userId);

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;

                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};

const logoutUser = (req, res) => {
    req.session.auth = null;
};

module.exports = {
    loginUser,
    restoreUser,
    logoutUser,
};
