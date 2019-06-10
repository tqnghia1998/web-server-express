var db = require('../utils/db')
module.exports = {
    all: ()=>{
        return db.load('SELECT  userID, Role, uName, Phone, Email, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users');
    },

    subs: ()=>{
        return db.load('SELECT  userID, Role, uName, Phone, Email, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users where Role = 4');
    },

    writer: ()=>{
        return db.load('SELECT  userID, Role, uName, Phone, Email, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users where Role = 2');
    },

    editor: ()=>{
        return db.load('SELECT  userID, Role, uName, Phone, Email, date_format(Birthday,"%d-%m-%Y") as Birthday FROM users where Role = 3');
    },

    single: id => {
        return db.load(`select * from users where userID = ${id}`);
    },

    singleByUsername: username => {
        return db.load(`select * from users where Username = '${username}'`);
    },

    add: entity => {
        return db.add(`users`, entity);
    },
    
    update: entity => {
        return db.update(`users`, userID, entity);
    }
};