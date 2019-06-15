var express = require('express');
var router = express.Router();
var postModel = require('../../models/posts.model');
var userModel = require('../../models/users.model');
var tagModel = require('../../models/tags.model');
var multer = require('multer');
var postsandtagsModel = require('../../models/postsandtags.model');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post('/uploadimage', upload.array('uploadphoto', 10), function (req, res, next) {
    var fileinfo = req.files;
    var title = req.body.title;
    console.log(title);
    res.send(fileinfo);
})

//Đã duyệt - chờ xuất bản
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        var idUser;// = req.session.passport.user.userID;

        var p = userModel.singlewriter(req.session.passport.user.userID);
        p.then(rowsUser => {

            if (rowsUser.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allApproved(req.session.passport.user.userID).then(rowsPost => {

                    console.log(rowsPost);
                    res.render('page/writer/index.handlebars', {
                        posts: rowsPost,
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
        var idUser;// = req.session.passport.user.userID;
        var p = userModel.singlewriter(req.session.passport.user.userID);
        p.then(rowsUser => {

            if (rowsUser.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allPublish(req.session.passport.user.userID).then(rowsPost => {
                    console.log(rowsPost);
                    res.render('page/writer/published.handlebars', {
                        posts: rowsPost,
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

router.get('/waiting', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singlewriter(req.session.passport.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                postModel.allWaiting(req.session.passport.user.userID).then(rowsPost => {
                    console.log(rowsPost);
                    res.render('page/writer/waiting.handlebars', {
                        posts: rowsPost,
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

router.get('/rejected', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleEditor(req.session.passport.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                
            }res.render('page/writer/rejected.handlebars');
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

router.get('/post', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singlewriter(req.session.passport.user.userID);
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

router.post('/post', (req, res, next) => {

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
        Writer: req.session.passport.user.userID,
        Premium: premium,
        Views: 0,
        Approved: 0,
        Additional: '',
        Published: 0,
        DayWritten: daywritten,
    }

    postModel.add(entity).then(idPost => {
        var alltag = req.body.HiddenTag.split(';');
        alltag.pop();
        for (var tag of alltag) {
            tagModel.add({ tagName: tag }).then(idTag => {
                postsandtagsModel.add({
                    posID: idPost,
                    tagID: idTag,
                })
            })
        }
    }).catch(err => {
        console.log(err);
    })
})

router.get('/update/:id', (req, res) => {
    if (req.isAuthenticated()) {
        var idPos = req.params.id;
        var p = userModel.singlewriter(req.session.passport.user.userID);
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
                        for (i = 0; i < rowsPostsAndTags.length; i++){
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



module.exports = router;