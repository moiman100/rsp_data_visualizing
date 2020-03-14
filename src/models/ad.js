"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AdsSchema = new Schema({
    name: String
});

module.exports = mongoose.model("Ad", AdsSchema);
