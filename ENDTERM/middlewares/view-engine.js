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
            checkIf: function (a, operator, b, options) {
                switch (operator) {
                    case '==':
                        return (a == b) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (a != b) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (a < b) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (a <= b) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (a > b) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (a >= b) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (a && b) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (a || b) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            }
        }
    }));
    app.set('view engine', 'handlebars');
}