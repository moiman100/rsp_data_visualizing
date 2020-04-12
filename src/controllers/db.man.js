const Ad = require("../models/ad.js");
const AdVersion = require("../models/adversion.js");
const UserSession = require("../models/session.js");
const AdEvent = require("../models/event.js");
const Graph = require("../models/graph.js");
var mongoose = require('mongoose');
var async = require('async');

// @desc  maybe a bit bubblegummy solution, calculates totals for events by list of valid event numbers

async function total(list) {
  var counts = "{";
  for (const item of list) {
    const event = await AdEvent.find(
      JSON.parse('{"event_number" : ' + '"' + item.toString() + '"' + "}")
    );
    counts =
      counts +
      ('"event_number ' +
        item.toString() +
        '"' +
        " : " +
        event.length.toString() +
        ", ");
  }
  return counts.substring(0, counts.length - 2) + "}";
}

// @desc    Get ads if req.body is empty gets all, if not the based on the attribut i.e {"name":"Test ad 1"}
// @route   GET /api/ad
exports.getAds = async (req, res, next) => {
  try {
    const ad = await Ad.find(req.body);
    return res.status(200).json({
      success: true,
      count: ad.length,
      data: ad,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add ads expects req to be json in this case {"name" : "ad name"}
// @route   POST /api/ad
exports.addAd = async (req, res, next) => {
  try {
    console.log(req.body);
    const ad = await Ad.create(req.body);
    return res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Insert default ad and version expects req to be json in this case {"name" : "ad name"}
// @route   POST /api/insert/ad
exports.insertAd = async (req, res, next) => {
  try {
    var ad = new Ad({
      name: req.body.name
    });

    var types = JSON.parse(req.body.types);

    ad.save(function (err) {
      if (err) {
        console.error(err);
      }

      var adVersion = new AdVersion({
        ad: ad._id,
        version_name: req.body.version,
        language: req.body.language,
        event_types: types
      });

      adVersion.save();
      return res.status(200).json({
        data: adVersion,
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get adVersion if req.body is empty gets all, if not the based on the attribute(s)
// @route   GET /api/version
exports.getVersion = async (req, res, next) => {
  try {
    const version = await AdVersion.find(req.query);
    return res.status(200).json({
      success: true,
      count: version.length,
      data: version,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add adVersion
// @route   POST /api/version
exports.addVersion = async (req, res, next) => {
  try {
    const version = await AdVersion.create(req.body);
    return res.status(200).json({
      success: true,
      data: version,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
// @desc    Get adVersion if req.body is empty gets all, if not the based on the attribute(s)
// @route   GET /api/version

exports.getVersion = async (req, res, next) => {
  try {
    const version = await AdVersion.find(req.query);
    return res.status(200).json({
      success: true,
      count: version.length,
      data: version,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add adVersion for ad
// @route   POST /api/insert/version
exports.insertVersion = async (req, res, next) => {
  try {
    const ad = await Ad.findOne({ name: req.body.name });
    var types = JSON.parse(req.body.types);

    var adVersion = new AdVersion({
      ad: ad._id,
      version_name: req.body.version,
      language: req.body.language,
      event_types: types,
    });

    adVersion.save();
    return res.status(200).json({
      data: adVersion,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

// @desc    Save graph
// @route   POST /api/graph
exports.addGraph = async (req, res, next) => {
  try {
    const graph = await Graph.create(req.body);
    return res.status(200).json({
      success: true,
      data: graph,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get saved graphs if req.body is empty gets all, if not the based on the attribute(s)
// @route   GET /api/graph
exports.getGraph = async (req, res, next) => {
  try {
    const graph = await Graph.find(req.query);
    return res.status(200).json({
      success: true,
      count: graph.length,
      data: graph,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

// @desc    Get Event(s) if req.body is empty gets all, if not the based on the attributes
// @route   GET /api/event
exports.getEvent = async (req, res, next) => {
  try {
    const event = await AdEvent.find(req.body);
    return res.status(200).json({
      success: true,
      count: event.length,
      data: event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    add Event
// @route   POST /api/event
exports.addEvent = async (req, res, next) => {
  try {
    const event = await AdEvent.create(req.body);
    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get Sessions(s) if req.body is empty gets all, if not the based on the attributes
// @route   GET /api/session
exports.getSession = async (req, res, next) => {
  try {
    const session = await UserSession.find(req.body);
    return res.status(200).json({
      success: true,
      count: session.length,
      data: session,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add Sessions
// @route   POST /api/session
exports.addSession = async (req, res, next) => {
  try {
    console.log(req.body);
    const session = await UserSession.create(req.body);
    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Insert sessions
// @route   POST /api/insert/session
exports.insertSession = async (req, res, next) => {
  try {
    const ad = await Ad.findOne({ name: req.body.advertisement });
    const version = await AdVersion.findOne({ ad: ad._id, version_name: req.body.ad_version });

    var userSession = new UserSession({
      version: version._id,
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      os: req.body.os,
      os_version: req.body.os_version,
      device: req.body.device,
      location: req.body.location,
    });

    userSession.save();
    return res.status(200).json({
      success: true,
      data: userSession,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Gets completed events in correct order grouped by sessionid
// @route   GET /api/completed
exports.getCompleted = async (req, res, next) => {
  var fun = req.body.order;
  //console.log(fun)
  var result = [];
  var count = 0;
  try {
    const num = await AdEvent.aggregate([
      { $match: { event_name: req.body.order[0] } },
      {
        $group: {
          _id: "$session",
          events: { $push: "$event_name" },
          //order_numbers: {$push: "$event_number"}
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: result.length,
      data: num, //await funnelings(fun[0],1)
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Gets sums of completed events
// @route   GET /api/totals
exports.getTotals = async (req, res, next) => {
  var counts = "";

  try {
    const num = await AdEvent.distinct("event_number", function (err, events) {
      // gets distinct event numbers
    });
    console.log(num);

    counts = await total(num);

    return res.status(200).json({
      success: true,
      count: num.length,
      data: JSON.parse(counts),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

function prepareParams(req) {
  // Prepares params for query ////////////////////////////////////////////////
  req.body.params.start_date = {};
  if (req.body.params.sDate != "") {
    req.body.params.start_date.$gte = req.body.params.sDate;
  }
  delete req.body.params.sDate;
  if (req.body.params.eDate != "") {
    req.body.params.start_date.$lte = req.body.params.eDate;
  }
  delete req.body.params.eDate;
  if (Object.keys(req.body.params.start_date).length === 0) {
    delete req.body.params.start_date;
  }

  req.body.params.os = {};
  req.body.params.os.$in = req.body.params.platforms;
  delete req.body.params.platforms;
  /////////////////////////////////////////////////////////////////////////////
}

// @desc    Gets funnel expects the order of events and the filter parameters
// @route   POST /api/funnel
exports.funs = async (req, res, next) => {
  var events = [];
  const funnel = req.body.order;

  prepareParams(req);

  try {
    const sessions = await UserSession.find(req.body.params);
    var result = [];
    var temp = [];
    var sess_id = []
    for (const sess of sessions) {
      sess_id.push(mongoose.Types.ObjectId(sess.id));
    }

    var match = { "$match": { "session": { "$in": sess_id } } };
    var group = { "$group": { "_id": "$session", "events": { $push: "$event_name" }, "numbers": { $push: "$event_number" } } };

    const event = await AdEvent.aggregate([match, group]);
    temp = event;

    for (var i = 0, l = funnel.length; i < l; i++) {
      temp = countings(funnel, temp, i);
      result.push(temp.length);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.log(err);
  }
};

// @desc    Gets sankey expects the adversion._id and the filter parameters
// @route   POST /api/sankey
exports.sankey = async (req, res, next) => {
  data = {
    node: {
      label: [],
    },
    link: {
      source: [],
      target: [],
      value: [],
    }
  };

  prepareParams(req);

  let node = data.node.label.push("start") - 1;

  async function addNodes(event_number, sessions, source_node) {
    const event_names = {};
    for (const session of sessions) {
      try {
        const event = await AdEvent.findOne({ session: session.id, event_number: event_number });
        if (!event) {
          continue;
        }
        if (!event_names[event.event_name]) {
          event_names[event.event_name] = [];

        }
        event_names[event.event_name].push(session);

      } catch (err) {
        console.log(err);
      }
    }
    for (let [event_name, sessions2] of Object.entries(event_names)) {
      let node = data.node.label.push(event_name) - 1;
      data.link.source.push(source_node);
      data.link.target.push(node);
      data.link.value.push(sessions2.length);
      await addNodes(event_number + 1, sessions2, node);
    }
  }

  try {
    const sessions = await UserSession.find(req.body.params);

    await addNodes(1, sessions, node);
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Gets funnel expects the order of events and the filter parameters. 
// Funnel in aggregation pipeline
// @route   POST /api/funnelalt
exports.funs_aggregate = async (req, res, next) => {

  try {
    var events = [];
    const funnel = req.body.order;
    const sessions = await UserSession.find(req.body.params);
    var result = [];
    var temp = [];
    var sess_id = []
    for (const sess of sessions) {
      sess_id.push(mongoose.Types.ObjectId(sess.id));
    }
    events = await aggregate(funnel, sess_id);
    temp = events[0]
    for (const key in temp) {
      if (temp[key] != null) {
        result.push(temp[key])

      }
    }

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.log(err);
  }
};

function countings(funnel, events, index) {
  var result = [];
  for (var i = 0, l = events.length; i < l; i++) {
    for (var n = 0, k = events[i].events.length; n < k; n++) {
      if (
        funnel[index] ===
        events[i].events[n] &&
        events[i].numbers[n] === index + 1
      ) {
        result.push(events[i]);
      }
    }
  }
  return result;
}

aggregate = async (funnel, sess_id) => {

  var ever = 999; //for cheking if even occured
  var match = { "$match": { "session": { "$in": sess_id } } }; //match session ids
  var match2 = { "$match": { "event_name": { "$in": funnel } } } //match names
  var projectActions = { "$project": { "s": "$session" } }

  funnel.forEach(function (e) {
    projectActions["$project"][e] = {};
    projectActions["$project"][e]["f"] = { "$cond": [{ "$eq": ["$event_name", e] }, "$event_number", ever] };
    projectActions["$project"][e]["t"] = { "$cond": [{ "$eq": ["$event_name", e] }, 1, 0] };
  });

  var groupBySession = { "$group": { "_id": "$s" } };

  funnel.forEach(function (e) {
    var first = e + "first";
    var times = e + "times";
    groupBySession["$group"][first] = { "$min": "$" + e + ".f" };
    groupBySession["$group"][times] = { "$sum": "$" + e + ".t" };
  });

  var didA = funnel[0];
  var andClause = { "$and": [] };
  var didFirst = { "$lt": ["$" + funnel[0] + "first", ever] };
  andClause["$and"].push(didFirst);

  var projectBool = { "$project": { "_id": 0, "_id": "$_id" } };
  projectBool["$project"][didA] = didFirst;

  for (var i = 1; i < funnel.length; i++) {
    didA = didA + funnel[i];
    andClause["$and"].push({ "$lt": ["$" + funnel[i] + "first", ever] });
    andClause["$and"].push({ "$gt": ["$" + funnel[i] + "first", "$" + funnel[i - 1] + "first"] });
    projectBool["$project"][didA] = { "$and": [] };
    andClause["$and"].forEach(function (a) { projectBool["$project"][didA]["$and"].push(a); });
  }

  var groupAll = { "$group": { "_id": null } };
  var didA = "";
  for (var i = 0; i < funnel.length; i++) {
    didA = didA + funnel[i];
    groupAll["$group"][funnel[i]] = { "$sum": { "$cond": ["$" + didA, 1, 0] } };
  }

  var t0 = new Date().getTime();

  const event = await AdEvent.aggregate([match, match2, projectActions, groupBySession, projectBool, groupAll]);
  var t1 = new Date().getTime();
  console.log("Funneling took " + (t1 - t0) + " milliseconds.");
  return event;
};

times = async () => {
  var lookup = { "$lookup": { from: "events", localField: "_id", foreignField: "session", as: "times" } };
  var unwind = { "$unwind": "$times" }
  var project = {
    "$project": {
      "version": 1,
      "start_date": 1,
      "stop_date": 1,
      "time": "$times.time"

    }
  }

  var lookup2 = { "$lookup": { from: "entities", localField: "times._id", foreignField: "_id", as: "times.times" } };
  var group = { "$group": { "_id": "$_id", "ad_version": { $first: "$version" }, "start": { $first: "$start_date" }, "stop": { $first: "$stop_date" }, "event_times": { $push: "$time" } } };
  var out = { "$out": "session_times" }
  const event = await UserSession.aggregate([lookup, unwind, lookup2, project, group, out]);
  console.log(event)
};

// GENERATING DUMMY EVENTS.

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
function randomEvent(events) {
  var action = events[Math.floor(Math.random() * events.length)];
  if (action == "Download") {
    action = randomEvent(events);
  }
  return action;
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

// Generates dummy sessions into an array 
function generateSessions(session_count) {
  const sessions = [];

  // For loop fills array with dummy sessions
  for (let i = 0; i < session_count; i++) {
    sessions.push(new sessionObject(randomUser(), randomOs(), randomOsversion(), randomDevice(), randomLocation()));
  }

  return sessions;
}

// Generates dummy events into an array
function generateEvents(event_count, events) {
  const eventList = [];
  let index = 1;

  // For loop fills array with dummy events
  for (let i = 1; i < event_count; i++) {
    eventList.push(new eventObject(randomEvent(events), "Horizontal", i));
    index++;
  }

  // Ends session with Download action
  eventList.push(new eventObject("Download", "Horizontal", index++));

  return eventList;
}

// @desc    Creates and saves a session and events
// @route   POST /api/dummyevents
exports.dummyEvents = async (req, res, next) => {
  try {
    const ad = await Ad.findOne({ name: req.body.name });
    const version = await AdVersion.findOne({ ad: ad._id, version_name: req.body.version });
    var version_id = version._id;
    const sessions = generateSessions(req.body.session_count);

    async.each(sessions, function (session_object, next) {
      var userSession = new UserSession({
        version: version_id,
        _id: new mongoose.Types.ObjectId(),
        name: session_object.name,
        os: session_object.os,
        os_version: session_object.osVersion,
        device: session_object.device,
        location: session_object.location
      });

      userSession.save()
        .then(function () {
          const events = generateEvents(req.body.event_count, version.event_types);

          async.each(events, function (event_object, next) {
            var event = new AdEvent({
              session: userSession._id,
              event_name: event_object.event_name,
              orientation: event_object.orientation,
              event_number: event_object.event_number
            });

            event.save(function (err) {
              next();
            });
          }, function done() {
            next();
          });
        });
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}
