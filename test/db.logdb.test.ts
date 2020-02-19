var mongoose = require("mongoose");
var Ad = require("../src/models/ad.ts");
var AdVersion = require("../src/models/adversion.ts");
var UserSession = require("../src/models/session.ts");
var AdEvent = require("../src/models/event.ts");

// Prints contents of database to console
async function logDb() {
    await Ad.find(function (err, ads) {
        if (err) return console.error(err);
        console.log(ads);
    });

    await AdVersion.find(function (err, versions) {
        if (err) return console.error(err);
        console.log(versions);
    });

    await UserSession.find(function (err, sessions) {
        if (err) return console.error(err);
        console.log(sessions);
    });

    await AdEvent.find(function (err, events) {
        if (err) return console.error(err);
        console.log(events);
    });

    mongoose.disconnect();
}

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {

        // Prints contents of database to console
        logDb();
    });
}

run();




