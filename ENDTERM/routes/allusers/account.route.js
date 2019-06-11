var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var userModel = require('../../models/users.model');
var categoryModel = require('../../models/categories.model');
var router = express.Router();

// Register zone
router.get('/register', (req, res, next) => {
    var listCate = categoryModel.all();
    listCate.then(rows => {
        res.render('page/allusers/register', {
            layout: 'main',
            categories: rows
        });
    }).catch(err => {
        console.log("Error when query categories" + err);
    })
});
router.post('/register', (req, res, next) => {
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);

    // Create an user entity
    var role = parseInt(req.body.role);
    var entity = {
        uName: req.body.fullname,
        Username: req.body.username,
        Password: hash,
        Role: role,
        Email: req.body.email,
        Birthday: req.body.birthday,
    }
    console.log(JSON.stringify(entity));
    
    // Add to database
    userModel.add(entity).then(id => {
        switch (role) {
        case 1:
            break;
        case 2:
            var writterEntity = {
                userID: id,
                Pseudonym: req.body.pseudonym
            }
            userModel.addWritter(writterEntity).then(id => {
                res.redirect('/allusers/login');
            })
            break;
        case 3:
            var editorEntity = {
                userID: id,
                cateID: req.body.category
            }
            userModel.addEditor(editorEntity).then(id => {
                res.redirect('/allusers/login');
            })
            break;
        case 4:
            var expired = new Date();
            expired.setDate(expired.getDate() + 7);
            var subsEntity = {
                userID: id,
                dateSubBegin: new Date(),
                dateSubEnd: expired
            }
            userModel.addSubs(subsEntity).then(id => {
                res.redirect('/allusers/login');
            })
            break;
        }
    });
});

// Login zone
router.get('/login', (req, res, next) => {
    res.render('page/allusers/login', {layout: 'main'});
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        // If login failed
        if (!user) {
            return res.render('page/allusers/login', {
                layout: 'main',
                err_message: info.message
            });
        }

        // If login succeeded
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/')
        })
    })(req, res, next);
});

// Lost pass zone
router.get('/lostpass', (req, res, next) => {
    res.render('page/allusers/lostpass', {layout: 'main'});
});

module.exports = router;