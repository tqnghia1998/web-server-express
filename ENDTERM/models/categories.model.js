var db = require('../utils/db');

module.exports = {
    allWithChild: () => {
        return db.load(`SELECT c.*, d1.dCateID as childid1, d1.dcateName as childnamed1, d2.dCateID as childid2, d2.dcateName as childnamed2 from categories c, detailcategory d1, detailcategory d2 WHERE c.cateID = d1.cateID and c.cateID = d2.cateID and d1.dCateID <> d2.dCateID group by(c.cateID)`);
    },
    add: entity => {
        return db.add(`categories`, entity);
    },

    all: () => {
        return db.load(`select c.cateID, c.cateName, parentID, count(p.posID) as numbersOf from categories c left join posts p on c.cateID = p.cateID group by c.cateID, c.cateName`);
    },

    single: id => {
        return db.load(`select * from categories where cateID = ${id}`);
    },

    allByCat: id => {
        return db.load(`select * from detailcategory where cateID = ${id}`);
    },

    single: id => {
        return db.load(`select * from categories where cateID = ${id}`);
    },

    // NghiaTQ
    singleWithChild: id => {
        return db.load(`SELECT child.cateName as child, parent.cateName as parent `
                     + `FROM categories as child LEFT JOIN categories as parent `
                     + `ON child.parentID = parent.cateID WHERE child.cateID = ${id}`)
    },
    allWithChild: () => {
        return db.load(`SELECT child.cateID, child.cateName as child, parent.cateName as parent `
                     + `FROM categories as child LEFT JOIN categories as parent `
                     + `ON child.parentID = parent.cateID`)
    }
}