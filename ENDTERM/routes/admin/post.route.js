var express = require('express');
var Model = require('../../models/posts.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.allbycate();
            u.then(rows => {
                console.log(rows);
                for (i = 0; i < rows.length; i++) {
                    var Day = rows[i].DayPublish;
                    rows[i].formatTitle = rows[i].Title.substring(0, 50);
                    if (Day == null) {
                        rows[i].isPublished = false
                    } else {
                        Day.setMinutes(Day.getMinutes() - Day.getTimezoneOffset());
                        if (!(Day.toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10)) || rows[i].Published) {
                            rows[i].isPublished = true;
                        }
                        else rows[i].isPublished = false;
                    }
                }
                res.render('page/admin/vwposts/post', {
                    layout: 'admin',
                    posts: rows
                });
            }).catch(error => {
                console.log(error);
            });
        } else {
            reres.render('page/admin/error', {
                layout: 'main',
            });
        }
    } else {
        res.render('page/admin/error', {
            layout: 'main',
        });
    }
});

router.post('/publish/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            var p = Model.single(id);
            p.then(rows => {
                if (rows.length > 0) {
                    var post = rows[0];
                    var entity = {
                        posID: post.posID,
                        DayPublish: new Date(),
                        Published: 1,
                    }
                }
                Model.update(entity).then(n => {
                    res.redirect('/admin/post')
                })
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

router.post('/delete/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            Model.delete(id).then(n => {
                res.redirect('/admin/post');
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
module.exports = router;