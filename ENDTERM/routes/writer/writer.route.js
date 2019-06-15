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

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleEditor(req.session.passport.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                // postModel
                res.render('page/writer/index.handlebars')
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

router.get('/published', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleEditor(req.session.passport.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {

                res.render('page/writer/published.handlebars');
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

router.get('/waiting', (req, res) => {
    if (req.isAuthenticated()) {
        var p = userModel.singleEditor(req.session.passport.user.userID);
        p.then(rows => {
            if (rows.length === 0) {
                res.redirect('/');
            }
            else {
                res.render('page/writer/waiting.handlebars');
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
                res.render('page/writer/rejected.handlebars');
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

router.get('/post', (req, res) => {
    // if (req.isAuthenticated()) {

    //     var p = userModel.singleEditor(req.session.passport.user.userID);
    //     p.then(rows => {
    //         if (rows.length === 0) {
    //             res.redirect('/');
    //         }
    //         else {
                res.render('page/writer/post.handlebars');
    //         }
    //     })
    // }
    // else {
    //     res.redirect('/allusers/login');
    // }
})

router.post('/post', (req, res, next) => {
    var param = req.body;
    var userID = 29;
    var premium = false;
    if (param.IsPremium === 'on') {
        premium = true;
    }

    var entity = {
        cateID: param.Category,
        Title: param.Title,
        DayPublish: null,
        Description: param.Description,
        Content: param.Content,
        Writer: userID,//req.session.passport.user.userID,
        Premium: premium,
        Views: 0,
        Approved: false,
        Additional: '',
        Published: false
    }


    postModel.add(entity).then(idPost => {
        var alltag = param.HiddenTag.split(';');
        alltag.pop();
        for (var tag of alltag){
            tagModel.add({tagName : tag}).then(idTag => {
                postsandtagsModel.add({
                    posID: idPost,
                    tagID: idTag,
                })
            })
        }
    }).catch(err => {
        console.log(err);
    })

    console.log(req.body);
})

module.exports = router;