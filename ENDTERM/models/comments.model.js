var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from comments`);
    },

    allByPost: id => {
        return db.load(`select * from comments where postID = ${id}`);
    },

    single: id => {
        return db.load(`select * from comments where commentID = ${id}`);
    },

    add: entity => {
        return db.add(`comments`, entity);
    },

    update: entity => {
        return db.update(`comments`, commentId, entity);
    }
}