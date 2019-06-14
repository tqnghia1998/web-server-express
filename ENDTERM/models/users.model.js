var db = require('../utils/db')
module.exports = {

    // Get all
    all: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users');
    },

    allSubs: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users INNER JOIN subscribers ON users.userID = subscribers.userID');
    },

    allWritter: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users INNER JOIN writters ON users.userID = writters.userID');
    },

    allEditor: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users INNER JOIN editors ON users.userID = editors.userID');
    },

    // Get by id
    single: id => {
        return db.load(`SELECT * FROM users WHERE userID = ${id}`);
    },
    singleSubs: id => {
        return db.load(`SELECT * FROM subscribers WHERE userID = ${id}`);
    },
    singleWritter: id => {
        return db.load(`SELECT * FROM writters WHERE userID = ${id}`);
    },
    singleEditor: id => {
        return db.load(`SELECT * FROM editors WHERE userID = ${id}`);
    },

    // Get by name
    singleByUsername: username => {
        return db.load(`SELECT * FROM users WHERE Username = '${username}'`);
    },
    singleByPseudonym: pseudonym => {
        return db.load(`SELECT * FROM writters WHERE Pseudonym = '${pseudonym}'`);
    },

    // Insert
    add: entity => {
        return db.add(`users`, entity);
    },
    addSubs: entity => {
        return db.add(`subscribers`, entity);
    },
    addWritter: entity => {
        return db.add(`writters`, entity);
    },
    addEditor: entity => {
        return db.add(`editors`, entity);
    },
    
    // Update
    update: entity => {
        return db.update(`users`, 'userID', entity);
    },
    updateSubs: entity => {
        return db.update(`subscribers`, 'userID', entity);
    },
    updateWritter: entity => {
        return db.update(`writters`, 'userID', entity);
    },
    updateEditor: entity => {
        return db.update(`editors`, 'userID', entity);
    }
};