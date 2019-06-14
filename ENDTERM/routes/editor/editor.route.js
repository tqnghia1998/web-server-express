var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('page/editor/editor.handlebars');
})

module.exports = router;