var express = require('express');
var router = express.Router();

// Model
var postsModel = require('../../models/posts.model');


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


module.exports = router;