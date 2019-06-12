var db = require('../utils/db');

module.exports = {
    // allWithChild: () => {
    //     return db.load(`SELECT c.*, d1.dCateID as childid1, d1.dcateName as childnamed1, d2.dCateID as childid2, d2.dcateName as childnamed2 from categories c, detailcategory d1, detailcategory d2 WHERE c.cateID = d1.cateID and c.cateID = d2.cateID and d1.dCateID <> d2.dCateID group by(c.cateID)`);
    // },
    add: entity => {
        return db.add(`categories`, entity);
    },
    // allWithChid: () => {
    //     var result = [];
    //     var categories;
    //     var p = all().then(rows => {
    //         categories = rows;
    //     })

    //     console.log(categories);

    //     return categories;
    // //     return db.load(`select * from detailcategory`);
    // },

    // single: id => {
    //     return db.load(`select * from categories where cateID = ${id}`);
    // },

    // allByCat: id => {
    //     return db.load(`select * from detailcategory where cateID = ${id}`);
    // }

    all: () => {
        return db.load(`select * from categories`);
    },

    single: id => {
        return db.load(`select * from categories where cateID = ${id}`);
    },

    
}