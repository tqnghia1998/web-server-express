var express = require('express');
var Model = require('../../models/posts.model');

var router = express.Router();

router.get('/', (req, res)=>{
    var u = Model.allbycate();
    
    u.then(rows=>{
        console.log(rows);
        res.render('page/admin/vwposts/post',{
            layout: 'admin',
            posts: rows
        });
    }).catch(error=>{
        console.log(error);
    });
    //res.end('lafm bieesn quas')
    
});
router.get('/viewpost', (req, res)=>{
    res.render('page/admin/vwposts/viewpost',{layout: 'admin'});
})

module.exports = router;