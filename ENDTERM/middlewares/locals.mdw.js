var categoriesModel = require('../models/categories.model');
var usersModel = require('../models/users.model');

module.exports = (req, res, next) => {
    categoriesModel.all().then(rows => {
        res.locals.lcCategories = rows;
        res.locals.isLoggedIn = req.isAuthenticated();
        next();
    })
}