var express = require('express');
var Model = require('../../models/tags.model');

var router = express.Router();

router.get('/', (req, res) => {
    var u = Model.all();
    u.then(rows => {
        console.log(rows);
        res.render('page/admin/vwtags/tag', {
            layout: 'admin',
            tags: rows,
            alert: false
        });
    }).catch(error => {
        console.log(error);
    });
    //res.end('lafm bieesn quas')

})
router.post('/', (req, res) => {
    var entity = {
        TagName: req.body.TagName
    }
    Model.add(entity).then(
        id => {
            console.log(id);
            res.redirect('/admin/tag');
        }).catch(error => {
            console.log(error);
        })
})

router.post('/update/:id', (req, res) => {
    var entity = {
        tagID: req.params.id,
        tagName: req.body.tagName
    }
    Model.update(entity).then(
        n => {
            res.redirect('/admin/tag');
        }).catch(error => {
            console.log(error);
            res.end('error occured!');
        })
})

router.post('/delete/:id', (req, res) => {
    var tagID = req.params.id;
    Model.delete(tagID).then(
        n => {
            res.redirect('/admin/tag');
        }).catch(error => {
            var u = Model.all();
            u.then(rows => {
                console.log(rows);
                res.render('page/admin/vwtags/tag', {
                    layout: 'admin',
                    tags: rows,
                    alert: true
                });
            }).catch(error => {
                console.log(error);
            });
        })
})
module.exports = router;