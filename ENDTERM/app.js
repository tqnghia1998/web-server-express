var express = require('express');
var exphbs  = require('express-handlebars');


var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res) {
    res.render('page/home', {layout: 'main'});
})
app.get('/admin', function(req, res) {
    res.render('page/admin/dashboard', {layout: 'admin'});
})
app.get('/admin/info', function(req, res) {
    res.render('page/admin/info', {layout: 'admin'});
})
app.get('/admin/dashboard', function(req, res) {
    res.render('page/admin/dashboard', {layout: 'admin'});
})
app.get('/admin/logout', function(req, res) {
    res.render('page/admin/logout', {layout: 'admin'});
})
app.get('/admin/post', function(req, res) {
    res.render('page/admin/post', {layout: 'admin'});
})
app.get('/admin/tag', function(req, res) {
    res.render('page/admin/tag', {layout: 'admin'});
})
app.get('/admin/user', function(req, res) {
    res.render('page/admin/user', {layout: 'admin'});
})
app.get('/login', function(req, res) {
    res.render('page/allusers/login', {layout: 'main'});
})
app.use('/admin/category', require('./routes/admin/category.route'));
app.listen(3000, () =>{
    console.log('server is running at http://localhost:3000')
})