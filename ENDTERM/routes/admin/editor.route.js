var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.allEditorForAdmin(3);
            u.then(rows => {
                console.log(rows);
                res.render('page/admin/vwEditors/editor', {
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
            var s = Model.detailEditor(id);
            s.then(rows => {
                if (rows.length > 0) {
                    Model.detailCateOfEditor(id).then(rowCates => {
                        Model.CateForEditor(id).then(rowCateForEditor => {
                            res.render('page/admin/vwEditors/detail', {
                                layout: 'admin',
                                Editors: rows[0],
                                CateOfEditor: rowCates,
                                CateForEditor: rowCateForEditor
                            });
                        })
                    })
                } else {
                    res.redirect('/admin/editor');
                }
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
router.post('/assign', (req, res) => {
    var entity = {
        userID: req.body.userID,
        cateID: req.body.Assigned
    };
    Model.addEditor(entity).then(n => {
        res.redirect('/admin/editor/detail/' + req.body.userID);
    }).catch(error => {
        console.log(error);
    });
})
router.post('/delete/:id', (req, res) => {
    var cateID = req.params.id;
    var userID = req.body.userID;
    Model.deletespecial(userID, cateID).then(n => {
        res.redirect('/admin/editor/detail/' + userID);
    }).catch(error => {
        console.log(error);
    });
})
router.post('/enable/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        userID: id,
        Actived: 1
    }
    Model.update(entity).then(n => {
        res.redirect('/admin/editor');
    }).catch(error => {
        res.redirect('/admin/editor');
        console.log(error);
    });
})
router.post('/disable/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        userID: id,
        Actived: 0
    }
    Model.update(entity).then(n => {
        res.redirect('/admin/editor');
    }).catch(error => {
        res.redirect('/admin/editor');
        console.log(error);
    });
})
module.exports = router;