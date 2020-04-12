"use strict";

var mongoose = require("mongoose");
var AdVersion = require("./adversion.js");

var Schema = mongoose.Schema;

var graphSchema = new Schema({
    version: { type: Schema.Types.ObjectId, ref: "AdVersion" },
    name: { type: String, default: "new_Graph" },
    type: String,
    date_created: { type: Date, default: Date.now },
    event_flow: [String],
    filter_params: {},
});

module.exports = mongoose.model("Graph", graphSchema);