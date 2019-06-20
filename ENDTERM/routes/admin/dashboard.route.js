var express = require('express');

var router = express.Router();
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.Role == 1) {
                    res.render('page/admin/dashboard', {layout: 'admin'});
                }else {
            res.render('page/admin/error', {
                layout: 'main',
            });
        }
    } else {
        res.render('page/admin/error', {
            layout: 'main',
        });
    }
})
module.exports = router;