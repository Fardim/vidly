const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const mongoose = require("mongoose");
const auth = require("./routes/auth");

if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey isnot defined");
    process.exit(1);
}

console.log(config.get("db"));
mongoose
    .connect(config.get("db"), { useNewUrlParser: true })
    .then(() => console.log("Connected to mongodb..."))
    .catch(err => console.log("couldnot connect to mongodb...", err));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Listening on port ${port}...`));
