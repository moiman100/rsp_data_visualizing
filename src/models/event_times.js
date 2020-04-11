"use strict";

var mongoose = require("mongoose");
var UserSession = require("./session.js");

var Schema = mongoose.Schema;

var EventTimeSchema = new Schema({
    session: { type: Schema.Types.ObjectId, ref: "UserSession" },
    os: String,
    version: String,
    times: { type : Array , "default" : [] }
    
});

module.exports = mongoose.model("Event_times", EventTimeSchema);