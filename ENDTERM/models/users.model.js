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
    singleAdmin: id => {
        return db.load(`SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users WHERE userID = ${id} and Role = '1'`);
    },
    singleSubs: id => {
        return db.load(`SELECT * FROM subscribers WHERE userID = ${id}`);
    },

    detailSubs: id => {
        return db.load(`SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday, date_format(dateSubBegin,"%d-%m-%Y") as dateBegin, date_format(dateSubEnd,"%d-%m-%Y") as dateEnd FROM users  INNER JOIN subscribers ON users.userID = subscribers.userID WHERE users.userID = ${id}`);
    },

    detailEditor: id => {
        return db.load(`select *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users WHERE users.userID = ${id}`);
    },

    detailCateOfEditor: id => {
        return db.load(`select c.cateID, c.cateName from categories c inner join editors e on e.cateID = c.cateID and e.userID = ${id}`);
    },

    CateForEditor: id => {
        return db.load(`select cateID, cateName from categories
        where cateID not in
        (select c.cateID from categories c inner join editors e on e.cateID = c.cateID and e.userID = ${id})`);
    },

    detailWriter: id => {
        return db.load(`select *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users  INNER JOIN writers ON users.userID = writers.userID WHERE users.userID = ${id}`);
    },

    singleWriter: id => {
        return db.load(`SELECT * FROM writers WHERE userID = ${id}`);
    },
    singleEditor: id => {
        return db.load(`SELECT * FROM editors INNER JOIN categories ON editors.cateID = categories.cateID AND editors.userID = ${id}`);
    },
    allEditorForAdmin: id =>{
        return db.load(`SELECT *, date_format(Birthday,"%d-%m-%Y") as formatBirthday FROM users WHERE users.Role = ${id}`);
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
    //delete
    deletespecial: (id1, id2) => {
        return db.load(`DELETE FROM editors WHERE (userID = '${id1}') and (cateID = '${id2}')`);
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
    },

    // Facebook
    singleWithFacebook: facebookID => {
        return db.load(`SELECT * FROM users WHERE FacebookID = '${facebookID}'`);
    },

    // TBN
    checkEditorToPremium: (idWriter, cateID) => {
        return db.load(`SELECT * FROM editors e where userID = ${idWriter} and cateID = ${cateID}`);
    },

    
};