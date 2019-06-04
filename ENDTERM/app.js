var express = require('express');
var exphbs  = require('express-handlebars');


var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res) {
    res.render('page/home', {layout: 'admin'});
});

app.listen(3000, () =>{
    console.log('server is running at http://localhost:3000')
})