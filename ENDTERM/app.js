var express = require('express');
// var morgan = require('morgan');
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
    res.redirect('/index');
})
app.get('/admin', function(req, res) {
    res.render('page/admin/dashboard', {layout: 'admin'});
})
app.get('/admin/dashboard', function(req, res) {
    res.render('page/admin/dashboard', {layout: 'admin'});
})
app.get('/admin/logout', function(req, res) {
    res.render('page/admin/logout', {layout: 'admin'});
})
// Some routes
app.use('/admin/subscriber', require('./routes/admin/subscriber.route'));
app.use('/admin/writer', require('./routes/admin/writer.route'));
app.use('/admin/editor', require('./routes/admin/editor.route'));
app.use('/admin/post', require('./routes/admin/post.route'));
app.use('/admin/category', require('./routes/admin/category.route'));
app.use('/admin/tag', require('./routes/admin/tag.route'));
app.use('/admin/info', require('./routes/admin/admin.route'));
app.use('/allusers', require('./routes/allusers/account.route'));
app.use('/userinfo', require('./routes/allusers/userinfo.route'));
app.use('/writer', require('./routes/writer/writer.route'));
app.use('/', require('./routes/guest/guest.route'));
app.use('/editor', require('./routes/editor/editor.route'));
app.use('/post', require('./routes/post.route'));

// Error handler
app.use((req, res, next) => {
    res.render('page/allusers/error', {
        layout: 'main',
        message: "Trang này không tồn tại",
        detail: "Bạn đã đi lạc rồi, hãy về trang chủ hoặc đăng nhập!"
    });
});
app.use((error, req, res, next) => {
    res.render('page/allusers/error', {
        layout: 'main',
        message: "Đã xảy ra lỗi " + error.message,
        detail: error.stack
    });
})

// Listen
app.listen(3000, () => {
    console.log('server is running at http://localhost:3000/');
})