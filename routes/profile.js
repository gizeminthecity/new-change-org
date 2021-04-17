const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.render("../views/profile-page.hbs");
});
module.exports = router;
