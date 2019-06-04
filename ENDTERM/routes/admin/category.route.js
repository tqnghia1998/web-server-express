var express = require('express');

var router = express.Router();

router.get('/', (req, res)=>{
    //res.end('lafm bieesn quas')
    res.render('page/admin/category', {layout: 'admin'});
})

router.get('/add', (req, res)=>{
    // res.render()
})
module.exports = router;