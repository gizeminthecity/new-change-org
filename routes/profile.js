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

  User.findByIdAndUpdate(
    req.session.user._id,
    { username, bio },
    { new: true }
  ).then((newUser) => {
    req.session.user = newUser;
    res.redirect("/profile");
  });
});

<<<<<<< HEAD
//router.get("/delete", isLoggedMiddleware, (req, res) => {
//User.findByIdAndDelete(req.session.user._id).then(() => {
// return res.redirect("/");
//});
//});

//rounter.get("/:dynamic/delete", isLoggedMiddleware, (req, res) =>{
// User.findById(req.params.dynamic).then() => {
//   if(!user) {
//     return res.redirect("/auth/login");
//}
//User.findByIdAndDelete(req.session.user._id).then() => {
//  return res.redirect("/")
//}
//}
//})
=======
>>>>>>> dev
module.exports = router;
