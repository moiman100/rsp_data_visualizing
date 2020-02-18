"use strict";

var mongoose = require("mongoose");
var UserSession = require("./session");

var Schema = mongoose.Schema;

var EventsInGameSchema = new Schema({
    session: { type: Schema.Types.ObjectId, ref: "UserSession" },
    event_name: String,
    orientation: String,
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventsInGameSchema);