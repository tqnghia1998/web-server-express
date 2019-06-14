var express = require('express');
var Model = require('../../models/users.model');

var router = express.Router();
router.get('/', (req, res)=>{
    var u = Model.allwriter();
    u.then(rows=>{
        console.log(rows);
        res.render('page/admin/writer',{
            layout: 'admin',
            users: rows
        });
    }).catch(error=>{
        console.log(error);
    });
    //res.end('lafm bieesn quas')
    
})
// router.get('/editor', (req, res)=>{
//     var u = userModel.editor();
//     u.then(rows=>{
//         console.log(rows);
//         res.render('page/admin/editor',{
//             users: rows,
//         });
//     }).catch(error=>{
//         console.log(error);
//     });
//     //res.end('lafm bieesn quas')
    
// })

module.exports = router;