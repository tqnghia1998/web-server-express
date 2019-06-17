var express = require('express');
var router = express.Router();
var postModel = require('../../models/posts.model');
var userModel = require('../../models/users.model');
var tagModel = require('../../models/tags.model');
var multer = require('multer');
var postsandtagsModel = require('../../models/postsandtags.model');
var imagesModel = require('../../models/images.model');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post('/uploadimage', upload.array('avatar'), (req, res, next) => {
    var fileinfo = req.body.files;
    console.log(fileinfo);
})

//Đã duyệt - chờ xuất bản
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        var idUser;// = req.user.userID;

        var p = userModel.singleWriter(req.user.userID);
        p.then(rowsUser => {
            if (rowsUser.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allApproved(req.user.userID).then(rowsPost => {

                    var isnull = false;
                    if (rowsPost.length === 0) {
                        isnull = true;
                    }

                    res.render('page/writer/index.handlebars', {
                        posts: rowsPost,
                        isNULL: isnull,
                    })
                }).catch(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

// Đã xuất bản
router.get('/published', (req, res) => {
    if (req.isAuthenticated()) {
        var idUser;// = req.user.userID;
        var p = userModel.singleWriter(req.user.userID);
        p.then(rowsUser => {

            if (rowsUser.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allPublish(req.user.userID).then(rowsPost => {
                    var isnull = false;
                    if (rowsPost.length === 0) {
                        isnull = true;
                    }
                    res.render('page/writer/published.handlebars', {
                        posts: rowsPost,
                        isNULL: isnull,
                    })

                }).catch(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

// Chờ xuất bản
router.get('/waiting', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleWriter(req.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allWaiting(req.user.userID).then(rowsPost => {
                    var isnull = false;
                    if (rowsPost.length === 0) {
                        isnull = true;
                    }
                    res.render('page/writer/waiting.handlebars', {
                        posts: rowsPost,
                        isNULL: isnull,
                    })
                }).catch(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

// Bị từ chối
router.get('/rejected', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleEditor(req.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allReject(req.user.userID).then(rowsPost => {
                    var isnull = false;
                    if (rowsPost.length === 0) {
                        isnull = true;
                    }
                    res.render('page/writer/rejected.handlebars', {
                        posts: rowsPost,
                        isNULL: isnull,
                    });
                })

            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

// Vào trang đăng bài
router.get('/post', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleWriter(req.user.userID);
        p.then(rows => {
            console.log(rows.length);
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                res.render('page/writer/post.handlebars');
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

// Đăng bài
router.post('/post', upload.array('avatar', 1), (req, res, next) => {

    var fileinfo = '/uploads/' + req.files[0].filename;
    var premium = false;
    if (req.body.IsPremium === 'on') {
        premium = true;
    }
    var now = new Date();
    var month = now.getMonth() + 1;
    var daywritten = now.getFullYear() + '/' + month + '/' + now.getDate();

    var entity = {
        cateID: req.body.Category,
        Title: req.body.Title,
        DayPublish: null,
        Description: req.body.Description,
        Content: req.body.Content,
        Writer: req.user.userID,
        Premium: premium,
        Views: 0,
        Approved: 0,
        Additional: '',
        Published: 0,
        DayWritten: daywritten,
    }

    postModel.add(entity).then(idPost => {
        imagesModel.add({posID: idPost, Url: fileinfo,}).then(rowsImage => {
            if (req.body.HiddenTag != "") {
                var alltag = req.body.HiddenTag.split(';');
                alltag.pop();
                for (var tag of alltag) {

                    tagModel.singleByName(tag).then(rowsTag => {
                        if (rowsTag.length === 0) {
                            tagModel.add({ tagName: tag }).then(idTag => {
                                postsandtagsModel.add({
                                    posID: idPost,
                                    tagID: idTag,
                                })
                            })
                        }
                        else {
                            postsandtagsModel.add({
                                posID: idPost,
                                tagID: rowsTag[0].tagID,
                            })
                        }
                    })
                    // tagModel.add({ tagName: tag }).then(idTag => {
                    //     postsandtagsModel.add({
                    //         posID: idPost,
                    //         tagID: idTag,
                    //     }).then(a => {
                    //         res.redirect('/writer');
                    //     })
                    // })
                }
            }
            res.redirect('/writer');
        })
    }).catch(err => {
        console.log(err);
    })
})

// Vào trang Sửa bài
router.get('/update/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var idPos = req.params.id;
        var p = userModel.singleWriter(req.user.userID);
        p.then(rowsUser => {
            console.log(rowsUser.length);
            if (rowsUser.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.single(idPos).then(rowsPost => {
                    postsandtagsModel.allByPost(idPos).then(rowsPostsAndTags => {
                        var hiddenTag = '';
                        var i;
                        for (i = 0; i < rowsPostsAndTags.length; i++) {
                            hiddenTag += rowsPostsAndTags[i].tagName + ';';
                        }
                        var isUpdate = true;
                        console.log(rowsPostsAndTags);
                        res.render('page/writer/post.handlebars', {
                            isUpdate: isUpdate,
                            post: rowsPost[0],
                            tag: rowsPostsAndTags,
                            hiddenTag: hiddenTag,
                        })
                    })
                })
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }


})

// Sửa bài
router.post('/update/:id', (req, res, next) => {

    var posID = req.params.id;

    var premium = false;
    if (req.body.IsPremium === 'on') {
        premium = true;
    }

    var now = new Date();
    var month = now.getMonth() + 1;
    var daywritten = now.getFullYear() + '/' + month + '/' + now.getDate();

    postModel.single(posID).then(rowsPost => {
        rowsPost[0].cateID = req.body.Category;
        rowsPost[0].Title = req.body.Title;
        rowsPost[0].Description = req.body.Description;
        rowsPost[0].Content = req.body.Content;
        rowsPost[0].Writer = req.user.userID;
        rowsPost[0].Premium = premium;
        rowsPost[0].DayWritten = daywritten;

        postModel.update(rowsPost[0]).then(rowsChage => {
            postsandtagsModel.deleteTagByPos(posID).then(() => {
                if (req.body.HiddenTag != "") {
                    var alltag = req.body.HiddenTag.split(';');
                    alltag.pop();
                    for (var tag of alltag) {
                        tagModel.add({ tagName: tag }).then(idTag => {
                            postsandtagsModel.add({
                                posID: idPost,
                                tagID: idTag,
                            }).then(a => {
                                res.redirect('/writer');
                            })
                        })
                    }
                }
                else {
                    res.redirect('/writer');
                }
            })
        })
    })

    // var entity = {
    //     cateID: req.body.Category,
    //     Title: req.body.Title,
    //     DayPublish: null,
    //     Description: req.body.Description,
    //     Content: req.body.Content,
    //     Writer: req.user.userID,
    //     Premium: premium,
    //     Views: 0,
    //     Approved: 0,
    //     Additional: '',
    //     Published: 0,
    //     DayWritten: daywritten,
    // }

    // postModel.add(entity).then(idPost => {
    //     if (req.body.HiddenTag != "") {
    //         var alltag = req.body.HiddenTag.split(';');
    //         alltag.pop();
    //         for (var tag of alltag) {
    //             tagModel.add({ tagName: tag }).then(idTag => {
    //                 postsandtagsModel.add({
    //                     posID: idPost,
    //                     tagID: idTag,
    //                 }).then(a => {
    //                     res.redirect('../writer/');
    //                 })
    //             })
    //         }
    //     }
    // }).catch(err => {
    //     console.log(err);
    // })
})

module.exports = router;