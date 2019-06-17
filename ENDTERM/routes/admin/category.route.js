var express = require('express');
var Model = require('../../models/categories.model');
var userModel = require('../../models/users.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.cateForAdmin();
            u.then(rows => {
                res.render('page/admin/vwCategories/category', {
                    layout: 'admin',
                    categories: rows,
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


router.get('/edit/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var id = req.params.id;
            if (isNaN(id)) {
                res.render('page/admin/vwCategories/edit', {
                    error: true
                })
            }
            Model.viewOneCate(id).then(rows => {
                if (rows.length > 0) {
                    var k = Model.cateLevel1(id);
                    k.then(parentRows => {
                        res.render('page/admin/vwCategories/edit', {
                            layout: 'admin',
                            categories: rows[0],
                            categoriesAdd: parentRows,
                            error: false,
                            exist: false
                        });
                    })
                } else {
                    res.render('page/admin/vwCategories/edit', {
                        layout: 'admin',
                        error: true,
                        exist: false
                    });
                }
            }).catch(error => {
                console.log(error);
                res.end('error in your id!');
            });
        } else {
            res.end('PERMISSION DENIED');
        }
    } else {
        res.end('PERMISSION DENIED');
    }
})

router.post('/update', (req, res) => {
    var id = req.body.cateID;
    var name = req.body.cateName;
    var parent = req.body.parentID;
    if (parent == "" || parent == null)
        parent = null;
    var entity = {
        cateID: id,
        cateName: name,
        parentID: parent
    }
    console.log(entity);
    Model.update(entity).then(
        id => {
            res.redirect('/admin/category');
        }).catch(error => {
            var u = Model.cateForAdmin();
            u.then(rows => {
                res.render('page/admin/vwCategories/category', {
                    layout: 'admin',
                    categories: rows,
                    exist: true
                });
            }).catch(error => {
                console.log(error);
            });
        });
})

router.post('/delete/:id', (req, res) => {
    var CateID = req.params.id;
    Model.delete(CateID).then(
        n => {
            res.redirect('/admin/category');
        }).catch(error => {
            var u = Model.all();
            u.then(rows => {
                res.render('page/admin/vwCategories/category', {
                    layout: 'admin',
                    categories: rows,
                    alert: true,
                    exist: false
                });
            })
        });
})

router.post('/add', (req, res) => {
    var name = null;
    var pID = null;
    name = req.body.CateName;
    pID = req.body.ParentID;
    if (pID == "" || pID == null)
        pID = null;
    var entity = {
        cateName: name,
        parentID: pID
    }
    Model.add(entity).then(
        id => {
            res.redirect('/admin/category');
        }).catch(error => {
            var u = Model.cateForAdmin();
            u.then(rows => {
                res.render('page/admin/vwCategories/category', {
                    layout: 'admin',
                    categories: rows,
                    exist: true
                });
            }).catch(error => {
                console.log(error);
            });
        });
})

module.exports = router;