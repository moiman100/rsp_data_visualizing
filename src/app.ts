const express = require("express");
const path = require("path");

const app = express();


// view engine setup
app.set('view engine', 'ejs');

// serve public directory
app.use(express.static('src/public'));

app.get("/", (req, res) => {
    res.render("index", {title: "Home"});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
})