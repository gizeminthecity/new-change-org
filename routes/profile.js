const router = require("express").Router();
const User = require("../models/User.model");
const isLoggedMiddleware = require("../middlewares/isLoggedIn");

router.get("/", isLoggedMiddleware, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/edit", isLoggedMiddleware, (req, res) => {
  res.render("edit-profile", { user: req.session.user });
});

router.post("/edit", isLoggedMiddleware, (req, res) => {
  const { username, bio } = req.body;

  user
    .findByIdAndUpdate(req.session.user._id, { username, bio }, { new: true })
    .then((newUser) => {
      req.session.user = newUser;
      res.redirect("/profile");
    });
});
module.exports = router;
