var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });
var Ad = require("../models/ad.ts");
var AdVersion = require("../models/adversion.ts");
var UserSession = require("../models/session.ts");
var AdEvent = require("../models/event.ts");

/* GET home page. */
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Inserts advertisements and ad versions into database
router.post('/insert/ad', function (req, res, next) {
    var ad = new Ad({
        name: req.body.name
    });

    ad.save(function (err) {
        if (err) {
            console.error(err);
        }

        var adVersion = new AdVersion({
            ad: ad._id,
            version_name: req.body.version,
            language: req.body.language
        });

        adVersion.save().then(function () {
            res.redirect('/dummy');
        })
            .catch(function (err) {
                console.error(err);
            });
    })
});

// Inserts user sessions into database
router.post('/insert/session', function (req, res, next) {
    Ad.findOne({ name: req.body.advertisement }, "_id", function (err, ad) {
        if (err) {
            console.error(err);
        }
        AdVersion.findOne({ ad: ad._id, version_name: req.body.ad_version }, "_id", function (err, version) {
            if (err) {
                console.error(err);
            }

            var userSession = new UserSession({
                version: version._id,
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                os: req.body.os,
                os_version: req.body.os_version,
                device: req.body.device,
                location: req.body.location
            });

            userSession.save()
                .then(function () {
                    res.send(userSession._id);
                    res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                });
        });
    });
});

// Inserts events into database
router.post('/insert/event', function (req, res, next) {
    var event = new AdEvent({
        session: req.body.session_id,
        event_name: req.body.event_name,
        orientation: req.body.orientation,
        event_number: req.body.event_number
    });

    event.save(function (err) {
        res.redirect('/');
    });
});

module.exports = router;