var express = require('express');
var Model = require('../../models/tags.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.all();
            u.then(rows => {
                res.render('page/admin/vwtags/tag', {
                    layout: 'admin',
                    tags: rows,
                    alert: false,
                    exist: false
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
router.post('/add', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var name = null;
            name = req.body.TagName;
            var entity = {
                TagName: name
            }
            Model.add(entity).then(
                id => {
                    res.redirect('/admin/tag');
                }).catch(error => {
                    var u = Model.all();
                    u.then(rows => {
                        console.log(rows);
                        res.render('page/admin/vwtags/tag', {
                            layout: 'admin',
                            tags: rows,
                            alert: false,
                            exist: true
                        });
                    }).catch(error => {
                        console.log(error);
                    });
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

router.post('/update/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var name = null;
            name = req.body.TagNameUpdate;
            var entity = {
                tagID: req.params.id,
                tagName: name
            }
            Model.update(entity).then(
                n => {
                    res.redirect('/admin/tag');
                }).catch(error => {
                    var u = Model.all();
                    u.then(rows => {
                        res.render('page/admin/vwtags/tag', {
                            layout: 'admin',
                            tags: rows,
                            alert: false,
                            exist: true
                        });
                    }).catch(error => {
                        console.log(error);
                    });
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

router.post('/delete/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var tagID = req.params.id;
            Model.delete(tagID).then(
                n => {
                    res.redirect('/admin/tag');
                }).catch(error => {
                    var u = Model.all();
                    u.then(rows => {
                        res.render('page/admin/vwtags/tag', {
                            layout: 'admin',
                            tags: rows,
                            alert: true,
                            exist: false
                        });
                    })
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