var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select *, date_format(DayPublish,"%d-%m-%Y") as datePublished from posts INNER JOIN categories ON posts.cateID = categories.cateID`);
    },

    single: id => {
        return db.load(`select * from posts where posID = ${id}`);
    },

    add: entity => {
        return db.add(`posts`, entity);
    },

    update: entity => {
        return db.update(`posts`, postID, entity);
    },

    allPublish: idWriter => {
        return db.load(`select * from posts where DATE(DayPublish) < Date(now())`)
    },

    allApproved: idWriter => {
        return db.load(`select * from posts where DATE(DayPublish) > Date(now())`);
    },
    
    // NghiaTQ
    mostViewedInWeek: (monday) => {
        return db.load(`SELECT posID, Title, Description, Views FROM posts WHERE DATE(DayPublish) >= '${monday}' ORDER BY Views DESC LIMIT 4`);
    },
    mostViewed: () => {
        var sqlQuery = "SELECT posID, Title, Views, Description, child.cateName as child, parent.cateName as parent "
                        + "FROM posts INNER JOIN categories as child ON posts.cateID = child.cateID "
                        + "LEFT JOIN categories as parent ON child.parentID = parent.cateID ORDER BY Views DESC LIMIT 10";
        return db.load(sqlQuery);
    },
    mostRecent: () => {
        var sqlQuery = "SELECT posID, Title, DayPublish, Description, child.cateName as child, parent.cateName as parent "
                        + "FROM posts INNER JOIN categories as child ON posts.cateID = child.cateID "
                        + "LEFT JOIN categories as parent ON child.parentID = parent.cateID ORDER BY DayPublish DESC LIMIT 10"
        return db.load(sqlQuery);
    },
    topCategories: () => {
        var sqlQuery = "SELECT child.cateName as child, parent.cateName as parent, posts.DayPublish, posts.Title, posts.posID "
                        + "FROM categories as child LEFT JOIN categories as parent ON child.parentID = parent.cateID "
                        + "LEFT JOIN posts ON posts.cateID = child.cateID WHERE DayPublish = ("
                        + "SELECT MAX(DayPublish) "
                        + "FROM posts "
                        + "WHERE posts.cateID = child.cateID) LIMIT 10";
        return db.load(sqlQuery);
    }
}