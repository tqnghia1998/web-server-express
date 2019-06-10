var express = require('express');
var app = express();

// Some initialization
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Some middleware
require('./middlewares/view-engine')(app);
require('./middlewares/passport')(app);
require('./middlewares/session')(app);

// Some single route
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
app.get('/admin/category', function(req, res) {
    res.render('page/admin/category', {layout: 'admin'});
})
app.get('/login', function(req, res) {
    res.render('page/allusers/login', {layout: 'main'});
})

// Some routes
app.use('/admin/subscriber', require('./routes/admin/user.route'));
app.use('/admin/writer', require('./routes/admin/writer.route'));
app.use('/admin/editor', require('./routes/admin/editor.route'));
app.use('/allusers', require('./routes/allusers/account.route'));

// Listen
app.listen(3000, () =>{
    console.log('server is running at http://localhost:3000')
})