var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select t.tagID, t.tagName, count(pt.posID) as numbersOf from tags t left join postsandtags pt on t.tagID = pt.tagID group by t.tagID, t.tagName`);
    },

    single: id => {
        return db.load(`select * from tags where tagID = ${id}`);
    },

    add: entity => {
        return db.add(`tags`, entity);
    },

    update: entity => {
        return db.update(`tags`, `tagID`, entity);
    },
    
}