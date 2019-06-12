var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var userModel = require('../../models/users.model');
var categoryModel = require('../../models/categories.model');
var verifyToken = require('generate-sms-verification-code');
var QRCode = require('qrcode');
var nodemailer =  require('nodemailer');
var router = express.Router();

// Register zone
router.get('/register/is-available', (req, res, next) => {
    userModel.singleByUsername(req.query.username).then(rows => {
        if (rows.length > 0) {
            return res.json(!(req.query.checkIsExisted == true));
        }
        return res.json(req.query.checkIsExisted == true);
    });
});
router.get('/register/is-pseudonym-available', (req, res, next) => {
    userModel.singleByPseudonym(req.query.pseudonym).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    });
});
router.get('/register', (req, res, next) => {

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
router.get('/changepass', (req, res, next) => {
    res.render('page/allusers/lostpass', {layout: 'main'});
});
router.post('/lostpass', (req, res) => {

    // Generate url
    

    // Get the user
    var user = userModel.singleByUsername(req.body.username);
    user.then(rows => {

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
            url
        }

        // Send mail
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log("Error when sending mail to change pass: " + err);
                res.redirect('/allusers/lostpass');
            } else {
                res.redirect('/allusers/login');
            }
        });
    }).catch(err => {
        console.log("Error when config mail to change pass: " + err);
        res.redirect('/allusers/lostpass');
    });
})

module.exports = router;