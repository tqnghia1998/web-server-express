var session = require('express-session')

module.exports = function (app) {
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }))
}