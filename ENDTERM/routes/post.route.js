var express = require('express');
var router = express.Router();
var postsModel = require('../models/posts.model');
var postsandtagsModel = require('../models/postsandtags.model');
var commentsModel = require('../models/comments.model');
var postsModel = require('../models/posts.model');
var usersModel = require('../models/users.model');
router.get('/:id', (req, res) => {

    var canViewPost = false;
    postsModel.single(req.params.id).then(rowsPost => {
        // Kiểm tra bài có phải premium không
        if (rowsPost[0].Premium) {
            console.log('Bài viết premium');
            if (req.isAuthenticated()) {
                console.log('Đã đăng nhập');
                // admin
                if (req.user.Role == 1) {
                    console.log('Là admin');
                    canViewPost = true;
                } else if (req.user.Role == 2 && rowsPost[0].Writer == req.user.userID) { // writer
                    console.log('Là writer viết bài này');
                    canViewPost = true;
                } else if (req.user.Role == 3) { // editor
                    usersModel.checkEditorToPremium(req.user.userID, rowsPost[0].cateID).then(rowsUsers => {
                        if (rowsUsers.length > 0) {
                            console.log('Là editor quản lý bài viết này');
                            canViewPost = true;
                        } else {
                            canViewPost = false;
                            console.log('Là editor không quản lý bài viết này');
                        }

                        if (canViewPost == true) {
                            postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
                                commentsModel.allByPost(req.params.id).then(rowsComment => {
                                    postsModel.fiveByCate(rowsPost[0].cateID, rowsPost[0].posID).then(rowsFivePost => {
                                        var entity = {
                                            posID: rowsPost[0].posID,
                                            Views: rowsPost[0].Views + 1,
                                        }
                                        rowsPost[0].Views++;
                                        postsModel.update(entity).then(rowsPostChange => {
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
                            });
                        } else {
                            console.log('Là editor nhưng không quản lý bài viết này');
                            res.render('page/guest/premiumNotice.handlebars');
                        }

                    })
                } else if (req.user.Role == 4) { // subs
                    usersModel.singleSubs(req.user.userID).then(rs => {
                        if (rs.length > 0)
                        {
                            if (rs[0].dateSubEnd > Date.now()) {
                                console.log('Là subscriber còn hạn premium');
                                canViewPost = true;
                            } else {
                                console.log('Là subscriber hết hạn premium');
                                canViewPost = false;
                            }
                        } else {
                            canViewPost == false;
                        }

                        if (canViewPost == true) {
                            postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
                                commentsModel.allByPost(req.params.id).then(rowsComment => {
                                    postsModel.fiveByCate(rowsPost[0].cateID, rowsPost[0].posID).then(rowsFivePost => {
                                        var entity = {
                                            posID: rowsPost[0].posID,
                                            Views: rowsPost[0].Views + 1,
                                        }
                                        rowsPost[0].Views++;
                                        postsModel.update(entity).then(rowsPostChange => {
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
                            });
                        } else {
                            res.render('page/guest/premiumNotice.handlebars');
                        }
                    })
                }

                if (req.user.Role == 1 || req.user.Role == 2) {
                    if (canViewPost == true) {
                        postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
                            commentsModel.allByPost(req.params.id).then(rowsComment => {
                                postsModel.fiveByCate(rowsPost[0].cateID, rowsPost[0].posID).then(rowsFivePost => {
                                    var entity = {
                                        posID: rowsPost[0].posID,
                                        Views: rowsPost[0].Views + 1,
                                    }
                                    rowsPost[0].Views++;
                                    postsModel.update(entity).then(rowsPostChange => {
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
                    } else {
                        console.log('Không xem được bài viết');
                        res.render('page/guest/premiumNotice.handlebars');
                    }
                }

            } else {
                console.log('chưa đăng nhập');
                res.render('page/guest/premiumNotice.handlebars');
            }
        } else {
            postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
                commentsModel.allByPost(req.params.id).then(rowsComment => {
                    postsModel.fiveByCate(rowsPost[0].cateID, rowsPost[0].posID).then(rowsFivePost => {
                        var entity = {
                            posID: rowsPost[0].posID,
                            Views: rowsPost[0].Views + 1,
                        }
                        rowsPost[0].Views++;
                        postsModel.update(entity).then(rowsPostChange => {
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
        }

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


// postsandtagsModel.allByPost(req.params.id).then(rowsPT => {
        //     commentsModel.allByPost(req.params.id).then(rowsComment => {
        //         postsModel.fiveByCate(rowsPost[0].cateID, rowsPost[0].posID).then(rowsFivePost => {
        //             var entity = {
        //                 posID: rowsPost[0].posID,
        //                 Views: rowsPost[0].Views + 1,
        //             }
        //             rowsPost[0].Views++;
        //             postsModel.update(entity).then(rowsPostChange => {
        //                 res.render('page/guest/viewpost.handlebars', {
        //                     post: rowsPost[0],
        //                     tags: rowsPT,
        //                     comments: rowsComment,
        //                     fiveSameCate: rowsFivePost,
        //                     numComment: rowsComment.length,
        //                     canView: canViewPost,
        //                 });
        //             })
        //         })
        //     })
        // })