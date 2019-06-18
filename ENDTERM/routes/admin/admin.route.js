var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
            console.log(req.user);
            Model.singleAdmin(req.user.userID).then(rows=>{
                if(rows.length>0){
                    console.log(rows);
                    res.render('page/admin/info', {
                        layout: 'admin',
                        users: rows[0]
                    });
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
module.exports = router;