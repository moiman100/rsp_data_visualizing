var mongoose = require("mongoose");
var Ad = require("../src/models/ad.js");
var AdVersion = require("../src/models/adversion.js");
var UserSession = require("../src/models/session.js");
var AdEvent = require("../src/models/event.js");
var async = require("async");

// Javascript object for Events
function eventObject(event_name, orientation, event_number) {
    this.event_name = event_name;
    this.orientation = orientation;
    this.event_number = event_number;
}

// Javascript object for UserSessions
function sessionObject(session_name, os, os_version, device, location) {
    this.name = session_name;
    this.os = os;
    this.os_version = os_version;
    this.device = device;
    this.location = location;
}

// Functions to randomize event and sessions parameters
function randomAction() {
    const actions = ["Click", "Clack", "Clock", "Pop"]; // Array of possible actions
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    return randomAction;
}

function randomUser() {
    const users = ["Joonas", "Mikko", "Atte", "Lauri", "Teemu", "Erkki"]; // Array of possible users
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return randomUser;
}

function randomOs() {
    const osystems = ["Android", "iOS", "Windows Phone"]; // Array of possible operating systems
    const randomOs = osystems[Math.floor(Math.random() * osystems.length)];
    return randomOs;
}

function randomOsversion() {
    const osversions = ["v10", "v47", "Lollipop", "2.7", "0.1"]; // Array of possible actions
    const randomOsversion = osversions[Math.floor(Math.random() * osversions.length)];
    return randomOsversion;
}

function randomDevice() {
    const devices = ["Honor 9", "Samsung Galaxy S8", "iPhone 11", "OnePlus 7"]; // Array of possible devices
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    return randomDevice;
}

function randomLocation() {
    const locations = ["Stockholm", "Helsinki", "London", "Wuhan"]; // Array of possible locations
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    return randomLocation;
}

// Generates dummy sessions into an array, alter for loop length to alter the number of sessions created 
function generateSessions(session_count) {
    // Array of Sessions
    const sessions = [];

    // For loop fills array with dummy sessions
    for (let i = 0; i < session_count; i++) {
        sessions.push(new sessionObject(randomUser(), randomOs(), randomOsversion(), randomDevice(), randomLocation()));
    }

    return sessions;
}

// Generates dummy events into an array, alter for loop length to change the number of events per session
function generateEvents(event_count) {
    // Array of Events
    const events = [];

    let index = 1;

    // For loop fills array with dummy events
    for (let i = 1; i < event_count; i++) {
        events.push(new eventObject(randomAction(), "Horizontal", i));
        index++;
    }

    // Ends session with Download action
    events.push(new eventObject("Download", "Horizontal", index++));

    return events;
}

// Creates and saves a session and events from the events array
function createSession(adName, versionName, session_count, event_count) {
    Ad.findOne({ name: adName }, "_id", function (err, ad) {
        if (err) {
            console.error(err);
        }
        AdVersion.findOne({ ad: ad._id, version_name: versionName }, "_id", function (err, version) {
            if (err) {
                console.error(err);
            }

            const sessions = generateSessions(session_count);

            async.each(sessions, function (session_object, next) {
                var userSession = new UserSession({
                    version: version._id,
                    _id: new mongoose.Types.ObjectId(),
                    name: session_object.name,
                    os: session_object.os,
                    os_version: session_object.osVersion,
                    device: session_object.device,
                    location: session_object.location
                });

                userSession.save()
                    .then(function () {

                        const events = generateEvents(event_count);

                        async.each(events, function (event_object, next) {
                            var event = new AdEvent({
                                session: userSession._id,
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
                            next();
                        });

                    }).catch(function (err) {
                        console.error(err);
                    });


            }, function done() {
                mongoose.disconnect();
            });

        });
    });
}

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {

        // Creates and saves sessions and events, parameters determine amount of sessions and events generated. Advertisement and version need to be in database
        createSession("Test Advertisement 1", "Test Version", 20, 10);

    });
}

run();