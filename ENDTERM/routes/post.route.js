var express = require('express');
var router = express.Router();
var postsModel = require('../models/posts.model');
var postsandtagsModel = require('../models/postsandtags.model');
var commentsModel = require('../models/comments.model');
var postsModel = require('../models/posts.model');

router.get('/:id', (req, res) => {
    postsModel.single(req.params.id).then(rowsPost => {
        postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
            commentsModel.allByPost(req.params.id).then(rowsComment => {
                postsModel.fiveByCate(rowsPost[0].cateID).then(rowsFivePost => {
                    res.render('page/guest/viewpost.handlebars', {
                        post: rowsPost[0],
                        tags: rowsPT,
                        comments: rowsComment,
                        fiveSameCate: rowsFivePost,
                        numComment: rowsComment.length,
                    });
                })
            })
        })
    })
})

router.post('/comment/:id', (req, res) => {
    if (req.body.comment != null) {
        var entity = {
            posID: req.params.id,
            content: req.body.comment,
            userID: req.user.userID,
            datePost: (new Date()),
        }
        
        commentsModel.add(entity).then(id => {
            res.redirect(req.get('referer'));
        }).catch(err => {
            console.log(err);
        })
    }
})
module.exports = router;