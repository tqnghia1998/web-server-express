var express = require('express');
var Model = require('../../models/tags.model');

var router = express.Router();

router.get('/', (req, res)=>{
    var u = Model.all();
    u.then(rows=>{
        console.log(rows);
        res.render('page/admin/tag',{
            layout: 'admin',
            tags: rows
        });
    }).catch(error=>{
        console.log(error);
    });
    //res.end('lafm bieesn quas')
    
})

module.exports = router;