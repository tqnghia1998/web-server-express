var express = require('express');
var router = express.Router();
var categoriesModel = require('../../models/categories.model');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post('/uploadimage', upload.array('uploadphoto', 10), function (req, res, next) {
    var fileinfo = req.files;
    var title = req.body.title;
    console.log(title);
    res.send(fileinfo);
})

router.get('/', (req, res) => {
    //Chưa có dữ liệu
    res.render('page/writer/index.handlebars');
})

router.get('/published', (req, res) => {
    //Chưa có dữ liệu
    res.render('page/writer/published.handlebars');
})

router.get('/waiting', (req, res) => {
    //Chưa có dữ liệu
    res.render('page/writer/waiting.handlebars');
})

router.get('/rejected', (req, res) => {
    //Chưa có dữ liệu
    res.render('page/writer/rejected.handlebars');
})

router.get('/post', (req, res) => {
    //Chưa có phân quyền
    // var p = categoriesModel.all();
    // p.then(rows => {
    //     res.render('page/writer/post.handlebars', {
    //         categories: rows
    //     });
    // }).catch(err => {
    //     console.log(err);
    //     res.end('error occured.');
    // });    
    res.render('page/writer/post.handlebars');
})

router.post('/post', (req, res) => {
    console.log(req.body.uploadphoto);
})

module.exports = router;