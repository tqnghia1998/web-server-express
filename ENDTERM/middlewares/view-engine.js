var hbs_sections = require('express-handlebars-sections');
var numeral = require('numeral');
var exphbs  = require('express-handlebars');

module.exports = function (app) {
    app.engine('handlebars', exphbs({
        defaultLayout: 'main.handlebars',
        layoutsDir: 'views/layouts',
        helpers: {
            format: val => {
                return numeral(val).format('0,0');
            },
            section: hbs_sections(),
            
        }
    }));
    app.set('view engine', 'handlebars');
}