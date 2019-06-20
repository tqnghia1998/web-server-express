var express = require('express');
var router = express.Router();

// Model
var userModel = require('../../models/users.model');
var verifyToken = require('generate-sms-verification-code');
var QRCode = require('qrcode');

// Package
var bcrypt = require('bcrypt');

// General information
router.get('/general', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    if (req.user.Role === 0) {
        return res.redirect('/allusers/newuser');
    }

    var userType;
    switch (req.user.Role) {
        case 1: userType = "Quản trị viên"; break;
        case 2: userType = "Phóng viên"; break;
        case 3: userType = "Biên tập viên"; break;
        case 4: userType = "Độc giả"; break;
    }

    res.render('page/userinfo/general', {
        layout: 'main',
        user: req.user,
        userType: userType
    })
});
router.post('/general', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    var entity = {
        userID: req.user.userID,
        uName: req.body.fullname,
        Email: req.body.email,
        Birthday: req.body.birthday
    }
    userModel.update(entity).then(id => {
        return res.redirect('/userinfo/general');
    }).catch(err => {
        console.log("Error when changing general user info: ", err);
        return res.redirect('/userinfo/general');
    })
});

// Change password
router.get('/changepass', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    var message;
    var color;
    switch (req.query.messagecode) {
        case '0': message = "Mật khẩu cũ không chính xác."; color = 'red'; break;
        case '1': message = "Thay đổi mật khẩu thành công."; color = 'green'; break;
    };

    res.render('page/userinfo/changepass', {
        layout: 'main',
        message: message,
        messagecolor: color
    })
});
router.post('/changepass', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    var oldpassword = req.body.oldpassword;
    var password = req.body.password;

    // Check if old password is true
    var ret = bcrypt.compareSync(oldpassword, req.user.Password);
    if (!ret) {
        return res.redirect('/userinfo/changepass?messagecode=0');
    }

    // Update to database
    var saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);
    var entity = {
        userID: req.user.userID,
        Password: hash
    }
    userModel.update(entity).then(id => {
        return res.redirect('/userinfo/changepass?messagecode=1');
    }).catch(err => {
        console.log("Error when changing password");
        return res.redirect('/userinfo/changepass?messagecode=0');
    })
});

// Pseudonym information
router.get('/writer', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    // Get pseudonym
    userModel.singleWriter(req.user.userID).then(rows => {
        if (rows.length !== 0) {
            res.render('page/userinfo/writer', {
                layout: 'main',
                pseudonym: rows[0].Pseudonym
            });
        }
        else {
            console.log("Error when open pseudonym page: ", "User is not a writer");
            return res.redirect('/userinfo/general');
        }
    }).catch(err => {
        console.log("Error when open pseudonym page: ", err);
        return res.redirect('/userinfo/general');
    })

});
router.post('/writer', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    var entity = {
        userID: req.user.userID,
        Pseudonym: req.body.pseudonym
    }
    userModel.updateWriter(entity).then(id => {
        return res.redirect('/userinfo/writer');
    }).catch(err => {
        console.log("Error when changing pseudonym: ", err);
        return res.redirect('/userinfo/writer');
    })
});

// Editor information
router.get('/editor', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    // Get editor
    userModel.singleEditor(req.user.userID).then(rows => {
        if (rows.length > 0) {

            // Get every categories
            var listCate = [];
            for (var i = 0; i < rows.length; i++) {
                listCate.push({
                    index: i + 1,
                    cateName: rows[i].cateName
                });
            }

            // Render to client
            res.render('page/userinfo/editor', {
                layout: 'main',
                listCate: listCate
            });
        }
        else {
            if (req.user.Role === 3) {
                return  res.render('page/userinfo/editor', {
                    layout: 'main',
                    listCate: []
                });
            }
            console.log("Error when open editor page: ", "User is not a editor");
            return res.redirect('/userinfo/general');
        }
    }).catch(err => {
        console.log("Error when open editor page: ", err);
        return res.redirect('/userinfo/general');
    })

});

// Subscriber infomation
router.get('/subscriber', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    // Get editor
    userModel.singleSubs(req.user.userID).then(rows => {
        if (rows.length > 0) {

            // If the subscription is expired
            var expiredDate = rows[0].dateSubEnd;
            expiredDate.setMinutes(expiredDate.getMinutes() - expiredDate.getTimezoneOffset());
            if (expiredDate.toISOString().slice(0,10) < new Date().toISOString().slice(0,10)) {
                var generatedToken = verifyToken(6, {type: 'string'})

                // Generate QRCode
                QRCode.toDataURL(generatedToken, function (err, url) {
                    res.render('page/userinfo/subscriber', {
                        layout: 'main',
                        qrCode: url,
                        token: generatedToken,
                        info: rows[0]
                    });
                });
            }
            else {
                res.render('page/userinfo/subscriber', {
                    layout: 'main',
                    qrCode: "",
                    token: "",
                    info: rows[0]
                });
            }
        }
        else {
            console.log("Error when open subscriber page: ", "User is not a subscriber");
            return res.redirect('/userinfo/general');
        }
    }).catch(err => {
        console.log("Error when open subscriber page: ", err);
        return res.redirect('/userinfo/general');
    })

});
router.post('/subscriber', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/allusers/login');

    // Save new sub info
    var expired = new Date();
    expired.setDate(expired.getDate() + 7);
    var subsEntity = {
        userID: req.user.userID,
        dateSubBegin: new Date(),
        dateSubEnd: expired
    }
    userModel.updateSubs(subsEntity).then(id => {
        return res.redirect('/userinfo/subscriber');
    }).catch(err => {
        console.log("Error when expanding subscription: ", err);
        return res.redirect('/userinfo/subscriber');
    });

});

module.exports = router;