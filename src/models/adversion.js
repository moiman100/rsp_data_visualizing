"use strict";

var mongoose = require("mongoose");
var Ad = require("./ad.js");

var Schema = mongoose.Schema;

var AdVersionsSchema = new Schema({
    ad: { type: Schema.Types.ObjectId, ref: "Ad" },
    version_name: String,
    release_date: { type: Date, default: Date.now },
    language: String
});

module.exports = mongoose.model("AdVersion", AdVersionsSchema);