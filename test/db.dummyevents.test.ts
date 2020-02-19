var mongoose = require("mongoose");
var Ad = require("../src/models/ad.ts");
var AdVersion = require("../src/models/adversion.ts");
var UserSession = require("../src/models/session.ts");
var AdEvent = require("../src/models/event.ts");
var async = require("async");

// Javascript object for Events
function event_object(event_name, orientation, event_number) {
    this.event_name = event_name;
    this.orientation = orientation;
    this.event_number = event_number;
}

// Array of Events, for loop fills it with dummy data
var events = [];
for (let index = 1; index < 100; index++) {
    events.push(new event_object("Download", "Horizontal", index));
}

// Creates and saves a session and events from the events array
function createSession(name, events) {
    AdVersion.findOne({ version_name: name }, "_id", function (err, version) {
        if (err) {
            console.error(err);
        }
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

        userSession.save()
            .then(function () {
                async.each(events, function (event_object, next) {
                    var event = new AdEvent({
                        session: id,
                        event_name: event_object.event_name,
                        orientation: event_object.orientation,
                        event_number: event_object.event_number
                    });

                    event.save(function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            next();
                        }
                    });
                }, function done() {
                    mongoose.disconnect();
                });

            }).catch(function (err) {
                console.error(err);
            });
    });
}

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {

        // Creates ands saves a session and an event. Advertisement and version need to be in database
        createSession("Test Version", events);

    });
}

run();
