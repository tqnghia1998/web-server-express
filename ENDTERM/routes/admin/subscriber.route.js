var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.allSubs();
            u.then(rows => {
                console.log(rows);
                res.render('page/admin/vwSubscribers/subscriber', {
                    layout: 'admin',
                    users: rows
                });
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

router.get('/detail/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            var s = Model.detailSubs(id);
            s.then(rows => {
                if (rows.length > 0) {
                    console.log(rows);
                    res.render('page/admin/vwSubscribers/detail', {
                        layout: 'admin',
                        subscribers: rows[0]
                    });
                } else {
                    res.redirect('/admin/subscriber');
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
router.post('/renew', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.body.userID;
            var s = Model.singleSubs(id);
            var days = req.body.Renewed;
            s.then(rows => {
                if (rows.length > 0) {
                    var expired = new Date(rows[0].dateSubEnd);
                    if (days == 7)
                        expired.setDate(expired.getDate() + 7);
                    if (days == 14)
                        expired.setDate(expired.getDate() + 14);
                    if (days == 21)
                        expired.setDate(expired.getDate() + 21);
                    if (days == 28)
                        expired.setDate(expired.getDate() + 28);
                    var entity = {
                        userID: id,
                        dateSubEnd: expired
                    }
                    Model.updateSubs(entity).then(n => {
                        res.redirect('/admin/subscriber/detail/' + id);
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    res.redirect('/admin/subscriber');
                }
            }).catch(error => {
                res.redirect('/admin/subscriber');
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
                res.redirect('/admin/subscriber');
            }).catch(error => {
                res.redirect('/admin/subscriber');
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
                res.redirect('/admin/subscriber');
            }).catch(error => {
                res.redirect('/admin/subscriber');
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