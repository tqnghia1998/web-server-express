var express = require('express');
var passport = require('passport');
var router = express.Router();

// Register zone
router.get('/register', (req, res, next) => {
    res.render('page/allusers/register', {layout: 'main'});
});
router.post('/register', (req, res, next) => {

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
        if (!user) {
            return res.render('page/allusers/login', {
                layout: 'main',
                err_message: info.message
            });
        }

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