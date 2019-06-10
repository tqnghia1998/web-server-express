var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from posts`);
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