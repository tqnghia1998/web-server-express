var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from images`);
    },

    single: id => {
        return db.load(`select * from images where userID = ${id}`);
    },

    add: entity => {
        return db.add(`images`, entity);
    },

}