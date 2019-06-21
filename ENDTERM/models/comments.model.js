var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from comments`);
    },

    allByPost: id => {
        return db.load(`SELECT *, date_format(datePost,"%d-%m-%Y %H:%m:%s") as DatePost FROM comments c join users u on c.userID = u.userID where posID = ${id}`);
    },

    single: id => {
        return db.load(`select * from comments where commentID = ${id}`);
    },

    add: entity => {
        return db.add(`comments`, entity);
    },

    update: entity => {
        return db.update(`comments`, commentId, entity);
    },

    deleteCommentsByPos: id => {
        return db.delete('comments', 'posID', id);
    },
}