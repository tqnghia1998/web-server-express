var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.allWriter();
            u.then(rows => {
                console.log(rows);
                res.render('page/admin/vwWriters/writer', {
                    layout: 'admin',
                    users: rows
                });
            }).catch(error => {
                console.log(error);
            });
        } else {
            res.end('PERMISSION DENIED');
        }
    } else {
        res.end('PERMISSION DENIED');
    }
})
router.get('/detail/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            var s = Model.detailWriter(id);
            s.then(rows => {
                if (rows.length > 0) {
                    console.log(rows);
                    res.render('page/admin/vwWriters/detail', {
                        layout: 'admin',
                        writers: rows[0]
                    });
                } else {
                    res.redirect('/admin/writer');
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            res.render('page/admin/error', {
                layout: 'main',
            });
        }
    } else {
        res.render('page/admin/error', {
            layout: 'main',
        });
    }
})

router.post('/enable/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            var entity = {
                userID: id,
                Actived: 1
            }
            Model.update(entity).then(n => {
                res.redirect('/admin/writer');
            }).catch(error => {
                res.redirect('/admin/writer');
                console.log(error);
            });
        } else {
            res.render('page/admin/error', {
                layout: 'main',
            });
        }
    } else {
        res.render('page/admin/error', {
            layout: 'main',
        });
    }
})
router.post('/disable/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
    var entity = {
        userID: id,
        Actived: 0
    }
    Model.update(entity).then(n => {
        res.redirect('/admin/writer');
    }).catch(error => {
        res.redirect('/admin/writer');
        console.log(error);
    });
        } else {
            res.render('page/admin/error', {
                layout: 'main',
            });
        }
    } else {
        res.render('page/admin/error', {
            layout: 'main',
        });
    }
})
module.exports = router;