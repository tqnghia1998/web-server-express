var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    console.log(req.session.passport.user)
    res.render('page/userinfo/userinfo', {
        layout: 'main',
        user: req.session.passport.user
    })
});

module.exports = router;