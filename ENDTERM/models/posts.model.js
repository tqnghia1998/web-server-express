var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from posts`);
    },
    allbycate: () => {
        return db.load(`select *, date_format(DayPublish,"%d-%m-%Y") as datePublished from posts INNER JOIN categories ON posts.cateID = categories.cateID`);
    },
    single: id => {
        return db.load(`select * from posts where posID = ${id}`);
    },

    add: entity => {
        return db.add(`posts`, entity);
    },

    update: entity => {
        return db.update(`posts`, 'posID', entity);
    },

    allWaitingEditor: idEditor => {
        return db.load(`select *, date_format(DayWritten,"%d-%m-%Y") as DayWrittenFormat from posts p join editors e on p.cateID = e.cateID join categories c on p.cateID = c.cateID where userID = ${idEditor} and Approved = 0 and Additional = ''`);
    },

    allPublish: idWriter => {
        return db.load(`select * from posts where (DayPublish < Date(now()) or Published = 1) and Writer = ${idWriter}`)
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
    },
    countPostByCate: (cateID) => {
        return db.load(`SELECT COUNT(*) AS total FROM posts WHERE posts.cateID = ${cateID}`);
    },
    countPostByTag: (tagName) => {
        var sqlQuery = `SELECT COUNT(*) AS total FROM baodientu16th.posts INNER JOIN baodientu16th.postsandtags `
                        + `ON posts.posID = postsandtags.posID INNER JOIN baodientu16th.tags `
                        + `ON postsandtags.tagID = tags.tagID AND tags.tagName = '${tagName}'`
        return db.load(sqlQuery);
    },
    postsByCate: (cateID, limit, offset) => {
        var sqlQuery = `SELECT posID, Title, DayPublish, Description, child.cateName as child, parent.cateName as parent `
                        + `FROM posts INNER JOIN categories as child ON posts.cateID IN ( `
                        + `SELECT cateID `
                        + `FROM categories c `
                        + `WHERE c.parentID = ${cateID} OR c.cateID = ${cateID})`
                        + `AND posts.cateID = child.cateID `
                        + `LEFT JOIN categories as parent ON child.parentID = parent.cateID LIMIT ${limit} OFFSET ${offset}`;
        return db.load(sqlQuery);
    },
    postsByTag: (tagName, limit, offset) => {
        var sqlQuery = `SELECT posts.posID, Title, DayPublish, Description, child.cateName as child, parent.cateName as parent `
                        + `FROM posts INNER JOIN postsandtags `
                        + `ON posts.posID = postsandtags.posID INNER JOIN tags ON postsandtags.tagID = tags.tagID AND tags.tagName = '${tagName}' `
                        + `LEFT JOIN categories as child ON posts.cateID = child.cateID `
                        + `LEFT JOIN categories as parent ON child.parentID = parent.cateID LIMIT ${limit} OFFSET ${offset}`;
        return db.load(sqlQuery);              
    },

    allApproved: idWriter => {
        return db.load(`select * from posts where (DayPublish > Date(now()) and Published = 0) and Writer = ${idWriter}`);
    },

    allWaiting: idWriter => {
        return db.load(`select *, date_format(DayWritten,"%d-%m-%Y") as DayWrittenFormat from posts p join categories c on p.cateID = c.cateID where Approved = 0 and Additional = '' and Writer = ${idWriter}`);
    },
    
    allReject: idWriter => {
        return db.load(`select * from posts where Approved = 0 and Additional <> '' and Writer = ${idWriter}`);
    },
}