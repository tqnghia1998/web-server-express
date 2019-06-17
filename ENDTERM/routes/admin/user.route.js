var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            var u = Model.allSubs();
            u.then(rows => {
                console.log(rows);
                res.render('page/admin/subscriber', {
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
module.exports = router;