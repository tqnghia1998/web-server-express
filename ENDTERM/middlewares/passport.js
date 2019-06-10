var passport = require('passport');
var userModel = require('../models/users.model')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy({
        usernameField: 'Username',
        passwordField: 'Password'
    }, (username, password, done) => {
        userModel.singleByUsername(username).then(rows => {
            if (rows.length === 0) {
                return done(err, false, {
                    message: 'Tài khoản không tồn tại'
                });
            }
            var user = rows[0];

            // Compare password
            // var ret = bcrypt.compareSync(password, user.Password);
            // if (ret) {}
            if (password != user.Password) {
                return done(null, false, {
                    message: 'Mật khẩu không chính xác'
                })
            }
            return done(null, user);
            
        }).catch(err => {
            return done(err, false);
        })
    });

    passport.use(ls);

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}