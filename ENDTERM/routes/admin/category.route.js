var express = require('express');
var Model = require('../../models/categories.model');

var router = express.Router();

router.get('/', (req, res) => {
    var u = Model.all();
    u.then(rows => {
        res.render('page/admin/vwCategories/category', {
            layout: 'admin',
            categories: rows,
            exist: false
        });
    }).catch(error => {
        console.log(error);
    });

})


router.get('/edit/:id', (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('page/admin/vwCategories/edit', {
            error: true
        })
    }
    Model.single(id).then(rows => {
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
            var u = Model.all();
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

router.post('/', (req, res) => {
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
            var u = Model.all();
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