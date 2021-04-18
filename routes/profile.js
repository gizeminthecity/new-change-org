const router = require("express").Router();
const User = require("../models/User.model.js");

router.get("/", (req, res, next) => {
    res.render("profile");
});
module.exports = router;
