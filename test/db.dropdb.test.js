var mongoose = require("mongoose");

var run = async function () {
    // Connects to specified database
    mongoose.connect("mongodb://mongo:27017/test", { useNewUrlParser: true });

    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
        // Drops database
        mongoose.connection.db.dropDatabase(function (err, result) {
            if (err) return console.error(err);
        })

        mongoose.disconnect();

    });
};

run();