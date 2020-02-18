var mongoose = require("mongoose");
var Ad = require("./models/ad");
var AdVersion = require("./models/adversion");
var UserSession = require("./models/session");
var Event = require("./models/event");

// Creates and saves an advertisement and ad version
async function createAd(Ad, AdVersion, name, version, language) {
    var ad = new Ad({
        name: name
    });

    ad.save(function (err) {
        if (err) return handleError(err);

        var adVersion = new AdVersion({
            ad: ad._id,
            version_name: version,
            language: language
        });

        adVersion.save(function (err) {
            if (err) return handleError(err);
        });
    });
}

// Creates and saves a session and an event
async function createSession(Ad, AdVersion, name, UserSession, Event) {
    AdVersion.findOne({ version_name: name }, "_id", function (err, version) {
        if (err) return handleError(err);
        var id = version._id;

        var userSession = new UserSession({
            version: id,
            _id: new mongoose.Types.ObjectId(),
            name: "Erkki",
            os: "Android",
            os_version: "v18",
            device: "Honor 9",
            location: "America"
        });

        userSession.save(function (err) {
            if (err) return handleError(err);

            var event = new Event({
                session: userSession._id,
                event_name: "Download",
                orientation: "Horizontal"
            });

            event.save(function (err) {
                if (err) return handleError(err);
            });
        });
    });
}

// Prints contents of database to console
async function logDb(Ad, AdVersion, UserSession, Event) {
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

    Event.find(function (err, events) {
        if (err) return console.error(err);
        console.log(events);
    });
}

// Connects to database
const test = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
        // Drops database
        /*mongoose.connection.db.dropDatabase(function(err, result) {
          if (err) return console.error(err);
        });*/

        // Creates and saves advertisement and ad version
        //createAd(Ad, AdVersion, "Test Advertisement 1", "Test Version", "English");

        // Creates ands saves a session and an event. Advertisement and version need to be in database
        //createSession(Ad, AdVersion, "Test Version", UserSession, Event);

        // Prints contents of database to console
        logDb(Ad, AdVersion, UserSession, Event);
    });
};

test();
