var categoriesModel = require('../models/categories.model');

module.exports = (req, res, next) => {
    categoriesModel.all().then(rows => {
        res.locals.lcCategories = rows;
        next();
    })
}