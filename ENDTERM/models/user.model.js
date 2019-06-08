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
    }
};