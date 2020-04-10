"use strict";

var mongoose = require("mongoose");
var UserSession = require("./session.js");

var Schema = mongoose.Schema;

var EventsInGameSchema = new Schema({
    session: { type: Schema.Types.ObjectId, ref: "UserSession" },
    event_name: String,
    orientation: String,
    event_number: Number,
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventsInGameSchema);