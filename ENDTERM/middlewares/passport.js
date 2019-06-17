var passport = require('passport');
var bcrypt = require('bcrypt');
var userModel = require('../models/users.model');
var LocalStrategy = require('passport-local').Strategy;

// Facebook
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('../utils/facebook');
var verifyToken = require('generate-sms-verification-code');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy({
        usernameField: 'Username',
        passwordField: 'Password'
    }, (username, password, done) => {
        userModel.singleByUsername(username).then(rows => {
            if (rows.length === 0) {
                return done(null, false, {
                    message: 'Tài khoản không tồn tại'
                });
            }
            var user = rows[0];

            // Compare password
            var ret = bcrypt.compareSync(password, user.Password);
            if (!ret) {
                return done(null, false, {
                    message: 'Mật khẩu không chính xác'
                })
            }
            return done(null, user);
            
        }).catch(err => {
            return done(err, false);
        })
    });

    passport.use('local', ls);

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        userModel.single(user.userID).then(users => {
            return done(null, users[0]);
        }).catch(err => {
            console.log("Error when deserializing user: ", err);
        });
    });

    // Facebook
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    },

    // Facebook will send user token and profile information
    function (token, refreshToken, profile, done) {

        // This is asynchronous
        process.nextTick(function () {

            // Look up into database to see if it already has this user
            userModel.singleWithFacebook(profile.id).then(rows => {
                if (rows.length > 0) {
                    return done(null, rows[0]);
                }
                
                // If it doesn't have, create one
                var generatedToken = verifyToken(16, {type: 'string'})
                var entity = {
                    Username: profile.id,
                    Password: generatedToken,
                    uName: profile.displayName,
                    Email: profile.emails[0].value,
                    Role: 0,
                    Actived: 1,
                    FacebookID: profile.id
                }
                userModel.add(entity).then(id => {
                    entity.userID = id;
                    return done(null, entity);
                }).catch(err => {
                    console.log("Error when add facebook user: ", err);
                    return done(null, err);
                })

            }).catch(err => {
                if (err) {
                    console.log("Error when get user by facebook id: ", err);
                    return done(err);
                }
            });
        });
    }))
}