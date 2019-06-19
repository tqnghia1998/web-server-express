var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from posts`);
    },
    allbycate: () => {
        return db.load(`select *, date_format(DayPublish,"%d-%m-%Y") as datePublished from posts INNER JOIN categories ON posts.cateID = categories.cateID`);
    },

    fiveByCate: cateID => {
        return db.load(`SELECT * FROM baodientu16th.posts where cateID = ${cateID} LIMIT 0, 5`)
    },

    single: id => {
        return db.load(`select * from posts p join categories c on p.cateID = c.cateID join writers w on p.Writer = w.userID where posID = ${id}`);
    },

    add: entity => {
        return db.add(`posts`, entity);
    },

    update: entity => {
        return db.update(`posts`, 'posID', entity);
    },

    delete: id => {
        return db.delete(`posts`, 'posID', id);
    },

    allWaitingEditor: idEditor => {
        return db.load(`select *, date_format(DayWritten,"%d-%m-%Y") as DayWrittenFormat from posts p join editors e on p.cateID = e.cateID join categories c on p.cateID = c.cateID where userID = ${idEditor} and Approved = 0 and Additional = ''`);
    },

    allPublish: idWriter => {
        return db.load(`select * from posts where (DayPublish < Date(now()) or Published = 1) and Writer = ${idWriter}`)
    },

    // NghiaTQ
    mostViewedInWeek: (monday) => {
        return db.load(`SELECT Premium, Url, posID, Title, Description, Views FROM posts WHERE DATE(DayPublish) >= '${monday}' AND Approved = 1 ORDER BY Views DESC LIMIT 4`);
    },
    mostViewed: () => {
        var sqlQuery = "SELECT Premium, Url, posID, Title, Views, Description, child.cateID, child.cateName as child, parent.cateName as parent "
            + "FROM posts INNER JOIN categories as child ON posts.cateID = child.cateID "
            + "LEFT JOIN categories as parent ON child.parentID = parent.cateID AND Approved = 1 ORDER BY Views DESC LIMIT 10";
        return db.load(sqlQuery);
    },
    mostRecent: () => {
        var sqlQuery = "SELECT Premium, Url, posID, Title, DayPublish, Description, child.cateID, child.cateName as child, parent.cateName as parent "
            + "FROM posts INNER JOIN categories as child ON posts.cateID = child.cateID "
            + "LEFT JOIN categories as parent ON child.parentID = parent.cateID AND Approved = 1 ORDER BY DayPublish DESC LIMIT 10"
        return db.load(sqlQuery);
    },
    topCategories: () => {
        var sqlQuery = "SELECT Premium, Url, child.cateID, child.cateName as child, parent.cateName as parent, posts.DayPublish, posts.Title, posts.posID "
            + "FROM categories as child LEFT JOIN categories as parent ON child.parentID = parent.cateID "
            + "LEFT JOIN posts ON posts.cateID = child.cateID WHERE DayPublish = ("
            + "SELECT MAX(DayPublish) "
            + "FROM posts "
            + "WHERE posts.cateID = child.cateID AND Approved = 1) LIMIT 10";
        return db.load(sqlQuery);
    },
    countPostByCate: (cateID) => {
        return db.load(`SELECT COUNT(*) AS total FROM posts WHERE posts.cateID IN ( `
        + `SELECT cateID `
        + `FROM categories c `
        + `WHERE c.parentID = ${cateID} OR c.cateID = ${cateID}) `
        + `AND Approved = 1`);
    },
    countPostByTag: (tagName) => {
        var sqlQuery = `SELECT COUNT(*) AS total FROM posts INNER JOIN postsandtags `
            + `ON posts.posID = postsandtags.posID INNER JOIN tags `
            + `ON postsandtags.tagID = tags.tagID AND tags.tagName = '${tagName}' WHERE Approved = 1`
        return db.load(sqlQuery);
    },

    countPostByKey: (keyWord) => {
        var sqlQuery = `select count(*) as numbers from posts 
        where
        (match(Title, Description, Content) against ('${keyWord}')
            or Title like '%${keyWord}%'
            or Description like '%${keyWord}%'
            or Content like '%${keyWord}%')
        and ((DayPublish < Date(now()) and Approved = 1) or Published = 1)`
        return db.load(sqlQuery);
    },

    getPostByKey: (keyWord, isSubs) => {
        var sqlQuery = `select *, date_format(DayPublish,"%d-%m-%Y") as datePublished from posts
        INNER JOIN categories ON posts.cateID = categories.cateID
        where
            (match(Title, Description, Content) against ('${keyWord}')
                or Title like '%${keyWord}%'
                or Description like '%${keyWord}%'
                or Content like '%${keyWord}%')
            and ((DayPublish < Date(now()) and Approved = 1) or Published = 1)`
        if(isSubs) 
            sqlQuery += `order by Premium desc`;
        return db.load(sqlQuery);
    },
    postsByCate: (cateID, limit, offset, isPremium) => {
        var sqlQuery = `SELECT Premium, Url, posID, Title, DayPublish, Description, child.cateID, child.cateName as child, parent.cateName as parent `
            + `FROM posts INNER JOIN categories as child ON posts.cateID IN ( `
            + `SELECT cateID `
            + `FROM categories c `
            + `WHERE c.parentID = ${cateID} OR c.cateID = ${cateID})`
            + `AND posts.cateID = child.cateID AND Approved = 1 `
            + `LEFT JOIN categories as parent ON child.parentID = parent.cateID ` + (isPremium ? ` ORDER BY Premium DESC ` : ` `)
            + `LIMIT ${limit} OFFSET ${offset}`;
        return db.load(sqlQuery);
    },
    postsByTag: (tagName, limit, offset, isPremium) => {
        var sqlQuery = `SELECT Premium, Url, posts.posID, Title, DayPublish, Description, child.cateID, child.cateName as child, parent.cateName as parent `
            + `FROM posts INNER JOIN postsandtags `
            + `ON posts.posID = postsandtags.posID INNER JOIN tags ON postsandtags.tagID = tags.tagID AND tags.tagName = '${tagName}' `
            + `LEFT JOIN categories as child ON posts.cateID = child.cateID `
            + `LEFT JOIN categories as parent ON child.parentID = parent.cateID `
            + `WHERE Approved = 1` + (isPremium ? ` ORDER BY Premium DESC ` : ` `)
            + `LIMIT ${limit} OFFSET ${offset}`;
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