var express = require('express');
var router = express.Router();

// Model
var postsModel = require('../../models/posts.model');
var postsTagsModel = require('../../models/postsandtags.model');
var categoriesModel = require('../../models/categories.model');

// Homepage
router.get('/index', (req, res, next) => {
    var mostViewedInWeek;
    var mostViewed;
    var mostRecent;
    var topCategories;

    // Get monday
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    postsModel.mostViewedInWeek(prevMonday.toISOString().slice(0, 10)).then(rows => {
        for (var i = 0; i < rows.length; i++) {
            rows[i].views = rows[i].Views + " lượt xem";
        }
        mostViewedInWeek = rows;

        // Top 10 most viewed
        postsModel.mostViewed().then(rows => {
            for (var i = 0; i < rows.length; i++) {
                rows[i].Description = rows[i].Description.substr(0, 250);
                rows[i].cateName = (rows[i].parent == null ? "" : rows[i].parent + " / ") + rows[i].child;
            }
            mostViewed = rows;

            // Top 10 recent
            postsModel.mostRecent().then(rows => {
                for (var i = 0; i < rows.length; i++) {
                    rows[i].Description = rows[i].Description.substr(0, 250);
                    rows[i].DayPublish = rows[i].DayPublish.toISOString().slice(0, 10);
                    rows[i].cateName = (rows[i].parent == null ? "" : rows[i].parent + " / ") + rows[i].child;
                }
                mostRecent = rows;

                // Top 10 categories
                postsModel.topCategories().then(rows => {
                    for (var i = 0; i < rows.length; i++) {
                        if (i % 3 == 2) rows[i].flag = true;
                        if (i == rows.length - 1) rows[i].end = true;
                        rows[i].DayPublish = rows[i].DayPublish.toISOString().slice(0, 10);
                        rows[i].cateName = (rows[i].parent == null ? "" : rows[i].parent + " / ") + rows[i].child;
                    }
                    topCategories = rows;
                    res.render('page/guest/index', {
                        layout: 'main',
                        mostViewedInWeek: mostViewedInWeek,
                        mostViewed: mostViewed,
                        mostRecent: mostRecent,
                        topCategories: topCategories
                    });
                })
            });
        });
    }).catch(err => {
        console.log("Error when opening homepage: ", err);
        return res.redirect('/allusers/login');
    })
});

// List news by category
router.get('/category/:cateid', (req, res, next) => {

    var cateID = req.params.cateid;
    if (cateID == null) {
        return res.redirect('/');
    }

    Promise.all([
        categoriesModel.singleWithChild(cateID),
        postsModel.countPostByCate(cateID)
    ]).then(([cate, countPost]) => {
        if (cate.length > 0) {

            // Standardlize cate name
            cate[0].cateName = (cate[0].parent == null ? "" : cate[0].parent + " / ") + cate[0].child;

            // Pagination
            var page = parseInt(req.query.page) || 1;
            if (page < 1) {
                return res.redirect('/guest/category/1?page=1');
            }
            var limit = 2;
            var offset = (page - 1) * limit;
            var pages = [];
            var total = countPost[0].total;
            var nPages = Math.floor(total / limit);
            var previousPage, nextPage;
            if (total % limit > 0) nPages++;
            for (i = 1; i <= nPages; i++) {
                var active = false;
                if (+page === i) {
                    active = true;
                    previousPage = (i == 1) ? 1 : (i - 1);
                    nextPage = (i == nPages) ? nPages : (i + 1);
                }
                var obj = { value: i, active }
                pages.push(obj);
            }

            // Get post of that cate
            var userRole = 0;
            if (req.user != null) {
                userRole = req.user.Role;
            }
            postsModel.postsByCate(cateID, limit, offset, userRole == 4).then(rows => {
                var countTime = 0;
                var length = rows.length;
                if (length === 0) {
                    return res.render('page/guest/category', {
                        layout: 'main',
                        cateName: cate[0].cateName.toUpperCase()
                    });
                }

                // Get tags of each post
                for (var i = 0; i < length; i++) {
                    rows[i].cateName = (rows[i].parent == null ? "" : rows[i].parent + " / ") + rows[i].child;
                    rows[i].DayPublish = rows[i].DayPublish.toISOString().slice(0, 10);
                    postsTagsModel.allByPost(rows[i].posID).then(tags => {
                        if (tags.length > 0) {
                            for (var j = 0; j < length; j++) {
                                if (rows[j].posID == tags[0].posID) {
                                    rows[j].tags = tags;
                                }
                            }
                        }
                        countTime += 1;
                        if (countTime == length) {
                            res.render('page/guest/category', {
                                layout: 'main',
                                data: rows,
                                cateName: cate[0].cateName.toUpperCase(),
                                pages: pages,
                                previousPage: previousPage,
                                nextPage: nextPage,
                                total: total
                            });
                        }
                    })
                }
            }).catch(err => {
                console.log("Error when geting post of a category: ", err);
                return res.redirect('/');
            })
        }
    }).catch(err => {
        console.log("Error when getting category: ", err);
    })
});

// List news by tag
router.get('/tag/:tagname', (req, res, next) => {

    var tagName = req.params.tagname;
    if (tagName == null) {
        return res.redirect('/');
    }

    postsModel.countPostByTag(tagName).then((countPost) => {

        // Pagination
        var page = parseInt(req.query.page) || 1;
        if (page < 1) {
            return res.redirect('/');
        }
        var limit = 2;
        var offset = (page - 1) * limit;
        var pages = [];
        var total = countPost[0].total;
        var nPages = Math.floor(total / limit);
        var previousPage, nextPage;
        if (total % limit > 0) nPages++;
        for (i = 1; i <= nPages; i++) {
            var active = false;
            if (+page === i) {
                active = true;
                previousPage = (i == 1) ? 1 : (i - 1);
                nextPage = (i == nPages) ? nPages : (i + 1);
            }
            var obj = { value: i, active }
            pages.push(obj);
        }

        // Get post contains that tag
        var userRole = 0;
        if (req.user != null) {
            userRole = req.user.Role;
        }
        postsModel.postsByTag(tagName, limit, offset, userRole == 4).then(rows => {
            var countTime = 0;
            var length = rows.length;
            if (length === 0) {
                return res.render('page/guest/tag', {
                    layout: 'main',
                    tagName: tagName
                });
            }

            // Get tags of each post
            for (var i = 0; i < length; i++) {
                rows[i].cateName = (rows[i].parent == null ? "" : rows[i].parent + " / ") + rows[i].child;
                rows[i].DayPublish = rows[i].DayPublish.toISOString().slice(0, 10);
                postsTagsModel.allByPost(rows[i].posID).then(tags => {
                    if (tags.length > 0) {
                        for (var j = 0; j < length; j++) {
                            if (rows[j].posID == tags[0].posID) {
                                rows[j].tags = tags;
                            }
                        }
                    }
                    countTime += 1;
                    if (countTime == length) {
                        res.render('page/guest/tag', {
                            layout: 'main',
                            data: rows,
                            tagName: tagName,
                            pages: pages,
                            previousPage: previousPage,
                            nextPage: nextPage,
                            total: total
                        });
                    }
                })
            }
        }).catch(err => {
            console.log("Error when geting post of a tag: ", err);
            return res.redirect('/');
        })
    }).catch(err => {
        console.log("Error when getting tag: ", err);
    })
})
router.post('/search', (req, res) => {
    var keyWord = req.body.keyWord;
    console.log(keyWord);
    if (keyWord == null) {
        return res.redirect('/');
    }
    postsModel.countPostByKey(keyWord).then(n => {
        var number = n[0].numbers;
        var  isSubs = false;
        console.log(number);
        if (req.isAuthenticated()) {
            if (req.user.Role == 4) {
                isSubs= true;
            }
        }
        postsModel.getPostByKey(keyWord, isSubs).then(rows => {
                console.log(rows);
                res.render('page/guest/viewResultSearch', {
                    layout: 'main',
                    key: keyWord,
                    data: rows,
                    numbers: number
                })
        })
    }).catch(error => {
        console.log(error);
        res.redirect('/');
    })
});

module.exports = router;