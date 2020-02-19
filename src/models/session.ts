"use strict";

var mongoose = require("mongoose");
var AdVersion = require("./adversion");

var Schema = mongoose.Schema;

var UserSessionsSchema = new Schema({
    version: { type: Schema.Types.ObjectId, ref: "AdVersion" },
    name: String,
    start_date: { type: Date, default: Date.now },
    stop_date: { type: Date, default: Date.now },
    os: String,
    os_version: String,
    device: String,
    location: String
});

module.exports = mongoose.model("UserSession", UserSessionsSchema);