var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();
router.get('/', (req, res)=>{
    var u = Model.allWriter();
    u.then(rows=>{
        console.log(rows);
        res.render('page/admin/writer',{
            layout: 'admin',
            users: rows
        });
    }).catch(error=>{
        console.log(error);
    });
    
})

module.exports = router;