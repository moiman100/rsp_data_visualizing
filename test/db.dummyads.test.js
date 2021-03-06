var mongoose = require("mongoose");
var Ad = require("../src/models/ad.js");
var AdVersion = require("../src/models/adversion.js");
var actions = ["Click", "Clack", "Clock", "Pop", "Download"];
// Creates and saves an advertisement and ad version
function createAd(name, version, language) {
    var ad = new Ad({
        name: name
    });

    ad.save(function (err) {
        if (err) {
            console.error(err);
        }

        var adVersion = new AdVersion({
            ad: ad._id,
            version_name: version,
            language: language,
            event_types: actions
        });

        adVersion.save().then(function () {
            mongoose.disconnect();
        })
            .catch(function (err) {
                console.error(err);
            });
    })
}

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {

        // Creates and saves advertisement and ad version
        createAd("Test Advertisement 1", "Test Version", "English");

    });
}

run();