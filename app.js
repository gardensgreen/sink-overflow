const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { asyncHandler } = require("./utils");
const { sequelize } = require("./db/models");
const { sessionSecret } = require("./config");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const answersRouter = require("./routes/answers");
const searchRouter = require("./routes/search");
const votesRouter = require("./routes/votes");

const { restoreUser } = require("./auth");

const store = new SequelizeStore({
    db: sequelize,
});

const app = express();

// view engine setup
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(
    session({
        name: "sink-overflow.sid",
        secret: sessionSecret,
        resave: false,
        store,
        saveUninitialized: false,
    })
);
store.sync();
app.use(express.static(path.join(__dirname, "public")));
app.use(restoreUser);
app.use("/", indexRouter);
app.use(usersRouter);
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);
app.use("/api/search", searchRouter);
app.use("/api/votes", votesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
