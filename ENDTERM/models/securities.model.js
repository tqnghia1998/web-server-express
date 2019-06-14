var db = require('../utils/db')
module.exports = {

    // Get by id
    get: id => {
        return db.load(`SELECT * FROM securities WHERE userID = ${id}`);
    },

    // Add
    add: entity => {
        return db.add(`securities`, entity);
    },

    // Update
    update: entity => {
        return db.update(`securities`, 'userID', entity);
    }
}