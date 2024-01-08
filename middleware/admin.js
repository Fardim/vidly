const jwt = require("jsonwebtoken");
const config = require("config");

//401 unauthorized
//403 forbidden
function admin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send("Access denied");
    next();
}
module.exports = admin;
