const express = require("express");
const { Op } = require("sequelize");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");

const router = express.Router();

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { term } = req.body;
        let questions = await db.Question.findAll({
            where: {
                title: {
                    [Op.iLike]: "%" + term + "%",
                },
            },
        });

        res.json({ questions });
    })
);
module.exports = router;
