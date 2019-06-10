// var hbs_sections = require('express-handlerbars-sections');
// var numeral = require('numaral');
var exphbs  = require('express-handlebars');

module.exports = function (app) {
    app.engine('handlebars', exphbs({
        defaultLayout: 'admin.handlebars',
        layoutsDir: 'views/layouts'
    }));
    app.set('view engine', 'handlebars');
}