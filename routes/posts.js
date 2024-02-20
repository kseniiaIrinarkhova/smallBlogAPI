const express = require("express");
const router = express.Router();
const posts = require("../data/posts");
const comments = require("../data/comments");
const error = require("../utilities/error");

router.route('/')
    .get((req, res, next) => {
        console.log(req.query)
        let userId = req.query["userId"];
        if (userId){
            const links = [
                {
                    href: `?userId=${userId}`,
                    rel: "",
                    type: "GET",
                }]
            let userPosts = posts.filter((p) =>  p.userId == userId );
            if(userPosts.length > 0) res.json({userPosts, links})
            else next(error(400, `User with ID='${userId}' does not have any posts`));
        }
        else res.json(posts);
    })
    .post((req, res, next) => {
        if (req.body.userId && req.body.title && req.body.content) {
            const post = {
                id: posts[posts.length - 1].id + 1,
                userId: req.body.userId,
                title: req.body.title,
                content: req.body.content,
            };

            posts.push(post);
            res.json(posts[posts.length - 1]);
        } else next(error(400, "Insufficient Data"));
    });



router.route('/:id')
    .get((req, res, next) => {
        const post = posts.find((p) => p.id == req.params.id);

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

        if (post) res.json({ post, links });
        else next();
    })
    .patch((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                for (const key in req.body) {
                    posts[i][key] = req.body[key];
                }
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    })
    .delete((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                posts.splice(i, 1);
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    });

router.route("/:id/comments")
    .get((req,res,next)=>{
        const post = posts.find((p) => p.id == req.params.id);
        let userId = req.query["userId"];
        if (post) {
            let postComments
            if(userId) postComments = comments.filter((c) => c.postId == post.id && c.userId == userId);
            else postComments = comments.filter((c) => c.postId == post.id);
            res.json(postComments);
        }
        else next();
    });

    module.exports = router;