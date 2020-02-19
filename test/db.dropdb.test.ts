var mongoose = require("mongoose");
var Ad = require("../src/models/ad.ts");
var AdVersion = require("../src/models/adversion.ts");
var UserSession = require("../src/models/session.ts");
var AdEvent = require("../src/models/event.ts");

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
        // Drops database
        mongoose.connection.db.dropDatabase(function (err, result) {
            if (err) return console.error(err);
        })

        mongoose.disconnect();

    });
};

run();