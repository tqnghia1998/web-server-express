var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select *, date_format(DayPublish,"%d-%m-%Y") as datePublished from posts INNER JOIN categories ON posts.cateID = categories.cateID`);
    },

    single: id => {
        return db.load(`select * from posts where postID = ${id}`);
    },

    add: entity => {
        return db.add(`posts`, entity);
    },

    update: entity => {
        return db.update(`posts`, postID, entity);
    }
}