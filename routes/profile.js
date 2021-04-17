const router = require("express").Router();
const user = required("../models/User.model.js");
router.get("/profile", (req, res, next) => {
  res.render("../views/profile-page.hbs");
});
module.exports = router;
