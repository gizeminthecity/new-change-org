const router = require("express").Router();
const SUBJECT_ENUM = require("../utils/consts");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Petition = require("../models/Petition.model");
const User = require("../models/User.model");
const UpdatePetition = require("../models/UpdatePetition.model");

/* GET home page */
router.get("/", (req, res, next) => {
    let user;

    if (req.session.user) {
        user = req.session.user;
    }
    console.log(req.session.user);
    res.render("index");
});

module.exports = router;
