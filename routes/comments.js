const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const error = require("../utilities/error");

router
    .route("/")
    .get((req, res) => {
        let userId = req.query["userId"];
        let postId = req.query["postId"];
        if(userId){
            console.log(`All comments for ${userId} user`)
            let userComments = comments.filter((c) => c.userId == userId);
            if (userComments.length > 0) res.json(userComments)
            else next(error(400, `User with ID='${userId}' does not have any comments`));
        }
        else if(postId)
        {
            console.log(`All comments for ${postId} post`)
            let userComments = comments.filter((c) => c.postId == postId);
            if (userComments.length > 0) res.json(userComments)
            else next(error(400, `There is no comments for post with ID = ${postId}`));
        }
        else{
        console.log('All comments')
        res.json({ comments});
        }
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