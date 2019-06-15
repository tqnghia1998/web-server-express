var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from posts`);
    },

    single: id => {
        return db.load(`select * from posts where posID = ${id}`);
    },

    add: entity => {
        return db.add(`posts`, entity);
    },

    update: entity => {
        return db.update(`posts`, 'posID', entity);
    },

    allWaitingEditor: idEditor => {
        return db.load(`select *, date_format(DayWritten,"%d-%m-%Y") as DayWrittenFormat from posts p join editors e on p.cateID = e.cateID join categories c on p.cateID = c.cateID where userID = ${idEditor} and Approved = 0 and Additional = ''`);
    },

    allPublish: idWriter => {
        return db.load(`select * from posts where (DayPublish < Date(now()) or Published = 1) and Writer = ${idWriter}`)
    },

    allApproved: idWriter => {
        return db.load(`select * from posts where (DayPublish > Date(now()) and Published = 0) and Writer = ${idWriter}`);
    },

    allWaiting: idWriter => {
        return db.load(`select *, date_format(DayWritten,"%d-%m-%Y") as DayWrittenFormat from posts p join categories c on p.cateID = c.cateID where Approved = 0 and Additional = '' and Writer = ${idWriter}`);
    },
    
    allReject: idWriter => {
        return db.load(`select * from posts where Approved = 0 and Additional <> '' and Writer = ${idWriter}`);
    },
}