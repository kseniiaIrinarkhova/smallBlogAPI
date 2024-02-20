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

router
    .route("/:id")
    .get((req, res, next) => {
        const comment = comments.find((c) => c.id == req.params.id);

        const links = [
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "PATCH",
            },
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "DELETE",
            },
        ];

        if (comment) res.json({ comment, links });
        else next();
    })
    .patch((req, res, next) => {
        const comment = comments.find((c, i) => {
            if (c.id == req.params.id) {
                for (const key in req.body) {
                    comments[i][key] = req.body[key];
                }
                return true;
            }
        });

        if (comment) res.json(comment);
        else next();
    })
    .delete((req, res, next) => {
        const comment = comments.find((c, i) => {
            if (c.id == req.params.id) {
                comments.splice(i, 1);
                return true;
            }
        });

        if (comment) res.json(comment);
        else next();
    });


module.exports = router;