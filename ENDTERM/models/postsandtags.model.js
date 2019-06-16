var db = require('../utils/db');

module.exports = {

    add: entity => {
        return db.add(`postsandtags`, entity);
    },

    allByPost: id => {
        return db.load(`select * from postsandtags p join tags t on p.tagID = t.tagID where posID = ${id}`);
    },

    allByPostSync: id => {
        return db.loadSync(`select * from postsandtags p join tags t on p.tagID = t.tagID where posID = ${id}`);
    }
}