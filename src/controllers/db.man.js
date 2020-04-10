const Ad = require("../models/ad.js");
const AdVersion = require("../models/adversion.js");
const UserSession = require("../models/session.js");
const AdEvent = require("../models/event.js");
var mongoose = require('mongoose');

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
    return res.status(400).json({
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
    return res.status(400).json({
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
    console.log(req.body);
    const event = await AdEvent.create(req.body);
    return res.status(400).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.log(err);
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
    return res.status(400).json({
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

    return res.status(400).json({
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

    return res.status(400).json({
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

// @desc    Gets funnel expects the order of events and the filter parameters
// @route   POST /api/funnel
exports.funs = async (req, res, next) => {
  var events = [];
  const funnel = req.body.order;

  try {
    const sessions = await UserSession.find(req.body.params);
    var result = [];
    var temp = [];
    var sess_id = []
    for(const sess of sessions) {
      sess_id.push(mongoose.Types.ObjectId(sess.id));
    }
    
    var match = { "$match" : { "session" : { "$in" : sess_id } }};
    var group = { "$group" : { "_id" : "$session", "events": {$push: "$event_name"}, "numbers":{$push: "$event_number"}}};

    const event = await AdEvent.aggregate([match, group]);
    temp = event;
    var t0 = new Date().getTime();
   for (var i = 0, l = funnel.length; i < l; i++) {
      temp = countings(funnel, temp, i);
      result.push(temp.length);
    }
    var t1 = new Date().getTime();
    console.log("Funneling took " + (t1 - t0) + " milliseconds.");

    return res.status(400).json({
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
        JSON.stringify(funnel[index]) ===
          JSON.stringify(events[i].events[n]) &&
        events[i].numbers[n] === index + 1
      ) {
        result.push(events[i]);
      }
    }
  }
  return result;
}

times = async () => {
  var lookup = { "$lookup" : { from: "events", localField: "_id", foreignField: "session", as: "times"}};
  var unwind = {"$unwind": "$times"}
  var project = { "$project": {
    "version":1,
    "start_date" : 1,
    "stop_date" : 1,
    "time" :"$times.time"

  }}

  var lookup2 = { "$lookup" : { from: "entities", localField: "times._id", foreignField: "_id", as: "times.times"}};
  var group = { "$group" : { "_id" : "$_id", "start": {$first: "$start_date"},"stop": {$first: "$stop_date"}, "event_times":{$push: "$time"}}};
  var out = {"$out" : "session_times"}
  const event = await UserSession.aggregate([lookup, unwind, lookup2, project, group, out]);
  console.log(event)
};
