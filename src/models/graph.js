"use strict";

var mongoose = require("mongoose");
var AdVersion = require("./adversion.js");

var Schema = mongoose.Schema;

var graphSchema = new Schema({
    version: { type: Schema.Types.ObjectId, ref: "AdVersion" },
    name: { type: String, default: "new_Graph" },
    date_created: { type: Date, default: Date.now },
    event_flow: { type : Array , "default" : [] },
    filter_params: { type : Array , "default" : [] }
});

module.exports = mongoose.model("Graph", graphSchema);