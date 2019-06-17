var express = require('express');
var Model = require('../../models/tags.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.all();
            u.then(rows => {
                console.log(rows);
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
            res.end('PERMISSION DENIED');
        }
    } else {
        res.end('PERMISSION DENIED');
    }
})
router.post('/add', (req, res) => {
    var name = null;
    name = req.body.TagName;
    var entity = {
        TagName: name
    }
    Model.add(entity).then(
        id => {
            console.log(id);
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
})

router.post('/update/:id', (req, res) => {
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
})

router.post('/delete/:id', (req, res) => {
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
})

module.exports = router;