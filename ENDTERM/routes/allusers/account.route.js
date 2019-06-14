var express = require('express');
var router = express.Router();

// Model
var userModel = require('../../models/users.model');
var categoryModel = require('../../models/categories.model');
var securityModel = require('../../models/securities.model');

// Package
var passport = require('passport');
var bcrypt = require('bcrypt');
var verifyToken = require('generate-sms-verification-code');
var QRCode = require('qrcode');
var nodemailer =  require('nodemailer');

// Register zone
router.get('/register/is-available-register', (req, res, next) => {
    userModel.singleByUsername(req.query.username).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    });
});
router.get('/register/is-available-lostpass', (req, res, next) => {
    userModel.singleByUsername(req.query.username).then(rows => {
        if (rows.length > 0) {
            return res.json(true);
        }
        return res.json(false);
    });
});
router.get('/register/is-pseudonym-available', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');

    userModel.singleByPseudonym(req.query.pseudonym).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    });
});
router.get('/register', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');

    // Generate code
    var generatedToken = verifyToken(6, {type: 'string'})
    var urlImage;

    // Generate QRCode
    QRCode.toDataURL(generatedToken, function (err, url) {
        urlImage = url;
    })
    
    // Get list of categories
    var listCate = categoryModel.all();
    listCate.then(rows => {
        res.render('page/allusers/register', {
            layout: 'main',
            categories: rows,
            qrCode: urlImage,
            token: generatedToken
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
                res.redirect('/allusers/login?messagecode=1');
            })
            break;
        case 3:
            var editorEntity = {
                userID: id,
                cateID: req.body.category
            }
            userModel.addEditor(editorEntity).then(id => {
                res.redirect('/allusers/login?messagecode=1');
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
                res.redirect('/allusers/login?messagecode=1');
            })
            break;
        }
    });
});

// Login zone
router.get('/login', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');
    var message;
    switch (req.query.messagecode) {
        case '1': message = "Đăng ký tài khoản thành công."; break;
        case '2': message = "Thông tin đăng nhập sai."; break;
        case '3': message = "Vui lòng kiểm tra E-mail."; break;
        case '4': message = "Đổi mật khẩu thành công."; break;
        case '5': message = "Đổi mật khẩu thất bại."; break;
        case '6': message = "Đăng xuất thành công."; break;
    };

    res.render('page/allusers/login', {layout: 'main', message: message});
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        // If login failed
        if (!user) {
            return res.redirect('/allusers/login?messagecode=2');
        }

        // If login succeeded
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/userinfo');
        })
    })(req, res, next);
});

// Lost pass zone
router.get('/lostpass', (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/');

    // Get userID and the token
    var userID = req.query.userid;
    var code = req.query.token;

    if (userID === undefined || code === undefined) {
        res.render('page/allusers/lostpass', {layout: 'main'});
    }
    else {

        // Check token is valid
        securityModel.get(userID).then(rows => {
            if (rows.length === 0) {
                res.json("Đường dẫn bị sai!");
            }
            else {
                var token = rows[0].password_reset_token;
                var expiredate = rows[0].password_reset_expire;
                if (token !== code) {
                    res.json("Token bị sai!");
                }
                else if (expiredate < new Date()) {
                    res.json("Token đã quá hạn!");
                }
                else {
                    res.render('page/allusers/restorepass', {
                        layout: 'main',
                        userID: userID,
                        code: code
                    });
                }
            }
        }).catch(err => {
            console.log("Error when trying get token from database: " + err);
        })
     }
});
router.post('/lostpass', (req, res, next) => {

    // Get the user
    var user = userModel.singleByUsername(req.body.username);
    user.then(rows => {
        res.redirect('/allusers/login?messagecode=3');

        // Calculate expire day
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 10);

        // Generate the token and save to database
        var code = verifyToken(32, {type: 'string'});
        var full_address = req.protocol + "://" + req.headers.host + req.originalUrl + "?userid=" + rows[0].userID + "&token=" + code;

        // Config mail server
        var transporter =  nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tonystrinh@gmail.com',
                pass: 'tqnghia1122'
            }
        });

        // Mail content
        var mainOptions = {
            from: 'Báo điện tử 16TH',
            to: rows[0].Email,
            subject: '[Báo điện tử 16TH] Yêu cầu đổi mật khẩu',
            html: '<p>Vui lòng kiểm tra thông tin dưới đây trước khi tiến hành đổi mật khẩu:</b>' + 
            '<ul><li>Họ tên: <b>' + rows[0].uName +
            '</b></li><li>Tên đăng nhập: <b>' + rows[0].Username +
            '</b></li></ul><p>Nếu thông tin trên là đúng, vui lòng truy cập đường dẫn sau:\n' +
            full_address
        }

        // Send mail
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log("Error when sending mail to change pass: " + err);
                res.redirect('/allusers/lostpass');
            } else {

                // Bring token to dabatase
                var securityEntity = {
                    userID: rows[0].userID,
                    password_reset_token: code,
                    password_reset_expire: expireDate
                }
                securityModel.get(rows[0].userID).then(result => {
                    if (result.length === 0) {
                        securityModel.add(securityEntity).then(re => {}).catch(er => {
                            console.log("Error when add new token to database: ", er);
                        });
                    }
                    else {
                        securityModel.update(securityEntity).then(re => {}).catch(er => {
                            console.log("Error when update token to database: ", er);
                        });
                    }
                }).catch(err => {
                    console.log("Error when save token to database: ", err);
                });
            }
        });
    }).catch(err => {
        console.log("Error when config mail to change pass: " + err);
        res.redirect('/allusers/lostpass');
    });
});
router.post('/restorepass', (req, res, next) => {
    var userID = req.body.userid;
    var code = req.body.code;

    // Check again
    securityModel.get(userID).then(rows => {
        if (rows.length !== 0) {
            var token = rows[0].password_reset_token;
            var expiredate = rows[0].password_reset_expire;
            if (token === code && expiredate > new Date()) {

                // Now change the password
                var saltRounds = 10;
                var hash = bcrypt.hashSync(req.body.password, saltRounds);
                userModel.single(userID).then(user => {
                    if (user.length !== 0) {
                        user[0].Password = hash;
                        userModel.update(user[0]).then(re => {
                            res.redirect('/allusers/login?messagecode=4');
                        });
                    }
                    else {
                        res.redirect('/allusers/login?messagecode=5');
                    }
                }).catch(err => {
                    console.log("Error when getting user id: " + err);
                });
            }
        }
    }).catch(err => {
        console.log("Error when reseting password: " + err);
    })
});

// Logout zone
router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/allusers/login?messagecode=6');
})

module.exports = router;