var express = require('express');
var postsModel = require('../../models/posts.model');
var usersModel = require('../../models/users.model');
var router = express.Router();

router.get('/', (req, res) => {

    if (req.isAuthenticated()) {
       
        usersModel.singleEditor(req.session.passport.user.userID).then(rowsEditor => {
            if (rowsEditor.length === 0){
                res.redirect('/');
            }
            else {
               
                postsModel.allWaitingEditor(req.session.passport.user.userID).then(rowsPost => {
                    console.log(rowsPost);
                    res.render('page/editor/editor.handlebars', {
                        posts: rowsPost,
                    });
                })
            }
        })
    }
    else {
        res.redirect('/allusers/login');
    }
})

router.post('/approve', (req, res) => {
    postsModel.single(req.body.posID1).then(rowsPost => {
        var entity = {
            posID: req.body.posID1,
            DayPublish: req.body.daypublish,
            Approved: 1,
        }
        
        postsModel.update(entity).then(rowsPost => {
            res.redirect('/editor');
        })
    })
})

router.post('/reject', (req, res) => {
    console.log(req.body.posID2);
    postsModel.single(req.body.posID2).then(rowsPost => {
        var entity = {
            posID: req.body.posID2,
            Additional: req.body.Additional,
        }
        postsModel.update(entity).then(rowsPost => {
            res.redirect('/editor');
        })
    })
})



module.exports = router;