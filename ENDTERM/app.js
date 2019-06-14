var express = require('express');
var app = express();

// Some initialization
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Some middleware
require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);
app.use(require('./middlewares/locals.mdw'));

// Some single route
app.get('/', function(req, res) {
    res.render('page/home', {
        layout: 'main',
        isLoggedIn: req.isAuthenticated()
    });
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
});

// Some routes
app.use('/admin/subscriber', require('./routes/admin/user.route'));
app.use('/admin/writer', require('./routes/admin/writer.route'));
app.use('/admin/editor', require('./routes/admin/editor.route'));
app.use('/admin/post', require('./routes/admin/post.route'));
app.use('/admin/category', require('./routes/admin/category.route'));
app.use('/admin/tag', require('./routes/admin/tag.route'));
app.use('/allusers', require('./routes/allusers/account.route'));
app.use('/userinfo', require('./routes/allusers/userinfo.route'));
app.use('/writer', require('./routes/writer/writer.route'));

// Listen
app.listen(3000, () =>{
    console.log('server is running at http://localhost:3000')
})