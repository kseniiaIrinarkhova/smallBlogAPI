const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const error = require("../utilities/error");

router
    .route("/")
    .get((req, res) => {
        console.log('All comments')
        res.json({ comments});
    })
    .post((req, res, next) => {
        if (req.body.postId && req.body.userId && req.body.body) {

            const comment = {
                id: comments[comments.length - 1].id + 1,
                postId: req.body.postId,
                userId: req.body.userId,
                body: req.body.body,
            };

            comments.push(comment);
            res.json(comments[comments.length - 1]);
        } else next(error(400, "Insufficient Data"));
    });

module.exports = router;