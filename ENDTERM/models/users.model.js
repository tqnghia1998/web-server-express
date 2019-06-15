var db = require('../utils/db')
module.exports = {

    // Get all
    all: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users');
    },

    allSubs: ()=>{
        return db.load('SELECT *, date_format(dateSubBegin,"%d-%m-%Y") as dateBegin, date_format(dateSubEnd,"%d-%m-%Y") as dateEnd FROM users INNER JOIN subscribers ON users.userID = subscribers.userID');
    },

    allWriter: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users INNER JOIN writers ON users.userID = writers.userID');
    },

    allEditor: ()=>{
        return db.load('SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users INNER JOIN editors ON users.userID = editors.userID INNER JOIN categories ON editors.cateID = categories.cateID' );
    },

    // Get by id
    single: id => {
        return db.load(`SELECT * FROM users WHERE userID = ${id}`);
    },
    singleSubs: id => {
        return db.load(`SELECT * FROM subscribers WHERE userID = ${id}`);
    },
    singleWriter: id => {
        return db.load(`SELECT * FROM writers WHERE userID = ${id}`);
    },
    singleEditor: id => {
        return db.load(`SELECT * FROM editors INNER JOIN categories ON editors.cateID = categories.cateID AND editors.userID = ${id}`);
    },

    // Get by name
    singleByUsername: username => {
        return db.load(`SELECT *, date_format(Birthday,"%M-%d-%Y") as formatBirthday FROM users WHERE Username = '${username}'`);
    },
    singleByPseudonym: pseudonym => {
        return db.load(`SELECT * FROM writers WHERE Pseudonym = '${pseudonym}'`);
    },

    // Insert
    add: entity => {
        return db.add(`users`, entity);
    },
    addSubs: entity => {
        return db.add(`subscribers`, entity);
    },
    addWriter: entity => {
        return db.add(`writers`, entity);
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
    updateWriter: entity => {
        return db.update(`writers`, 'userID', entity);
    },
    updateEditor: entity => {
        return db.update(`editors`, 'userID', entity);
    }
};