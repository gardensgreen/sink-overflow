const express = require("express");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

const router = express.Router();

const addVoteCount = (question) => {
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

router.get(
    "/questions/:id(\\d+)",
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.id, 10);

        const question = await db.Question.findByPk(id, {
            include: db.Vote,
        });

        addVoteCount(question);

        res.json({ voteCount: question.voteCount });
    })
);

router.get(
    "/answers/:id(\\d+)",
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.id, 10);

        const answer = await db.Answer.findByPk(id, {
            include: db.Vote,
        });
        addVoteCount(answer);

        res.json({ voteCount: answer.voteCount });
    })
);

router.post(
    "/questions/:id(\\d+)",
    asyncHandler(async (req, res) => {
        if (!res.locals.authenticated) {
            res.redirect("/login");
        }

        const { isDownvote } = req.body;
        const questionId = parseInt(req.params.id, 10);

        const exactVote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                isDownvote: isDownvote,
                questionId: questionId,
            },
        });

        const editVote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                isDownvote: !isDownvote,
                questionId: questionId,
            },
        });

        if (exactVote) {
            await exactVote.destroy();
        } else if (editVote) {
            await editVote.update({
                isDownvote,
            });
        } else {
            await db.Vote.create({
                isDownvote,
                userId: res.locals.user.id,
                questionId,
            });
        }

        const question = await db.Question.findByPk(questionId, {
            include: db.Vote,
        });

        addVoteCount(question);
        voteCount = question.voteCount;

        res.json({ voteCount });
    })
);

router.post(
    "/answers/:id(\\d+)",
    asyncHandler(async (req, res) => {
        if (!res.locals.authenticated) {
            res.redirect("/login");
        }

        const { isDownvote } = req.body;
        const answerId = parseInt(req.params.id, 10);

        const exactVote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                isDownvote: isDownvote,
                answerId: answerId,
            },
        });

        const editVote = await db.Vote.findOne({
            where: {
                userId: res.locals.user.id,
                isDownvote: !isDownvote,
                answerId: answerId,
            },
        });

        if (exactVote) {
            await exactVote.destroy();
        } else if (editVote) {
            await editVote.update({
                isDownvote,
            });
        } else {
            await db.Vote.create({
                isDownvote,
                userId: res.locals.user.id,
                answerId,
            });
        }

        const answer = await db.Answer.findByPk(answerId, {
            include: db.Vote,
        });

        addVoteCount(answer);

        res.json({ voteCount: answer.voteCount });
    })
);

module.exports = router;
