var categoriesModel = require('../models/categories.model');

module.exports = (req, res, next) => {
    categoriesModel.all().then(rows => {
        res.locals.lcCategories = rows;
        console.log(rows);
        res.locals.isLoggedIn =  req.isAuthenticated();
        next();
    })
}