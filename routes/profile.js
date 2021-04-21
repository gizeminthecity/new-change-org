const router = require("express").Router();
const User = require("../models/User.model");
const isLoggedMiddleware = require("../middlewares/isLoggedIn");
const Petition = require("../models/Petition.model");
const UpdatePetition = require("../models/UpdatePetition.model");
const parser = require("../config/cloudinary");

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

router.get("/delete", isLoggedMiddleware, async (req, res) => {
    try {
        const userId = req.session.user._id;
        // Delete the user
        await User.findByIdAndDelete(userId);

        const allPetitionsByUser = await Petition.find({ owner: userId });

        // console.log("allPetitions byIser:", allPetitionsByUser); // array of all of petitions we need to delete;

        await Promise.all(
            allPetitionsByUser.map((e) => Petition.findByIdAndDelete(e._id))
        );
        // array of all of the update petitions for each single petition created by a user
        const updatePetitions = allPetitionsByUser.map((e) =>
            UpdatePetition.find({ parent: e._id })
        );

        const allUpdatePetitions = await Promise.all(updatePetitions);
        //array of updates we need to delete;

        const ids = allUpdatePetitions.flat().map((e) => e._id);

        await Promise.all(ids.map((e) => UpdatePetition.findByIdAndDelete(e)));

        const allPetitionsSigned = await Petition.find({
            signatures: { $in: userId },
        });

        console.log(allPetitionsSigned); // array of petitions we need to update by removing the user
        await Promise.all(
            allPetitionsSigned.map((e) =>
                Petition.findByIdAndUpdate(e._id, {
                    $pull: { signatures: userId },
                })
            )
        );

        // res.render("profile");
        res.clearCookie("connect.sid"); // the default name of the session cookie name in the browser. so, cookiewise logging out the user
        res.redirect("/");
    } catch (error) {
        console.log("OOPSIE: ", error.message);
        res.redirect("/");
    }

    // //  listing of all petitions by the current user
    // const allPetitionsByUser = await Petition.find({
    //   owner: req.session.user._id,
    // })

    // const arrayOfPetitionIds = allPetitionsByUser.map(e => e._id)

    // // it bulk deletes all of the previously defined petitions
    // await Petition.deleteMany({
    //   _id: { $in: arrayOfPetitionIds },
    // });

    // // listing of all of the petitions in the db, that the user signed
    // const everyPetitionSignedByUser = await Petition.find({
    //   signatures: { $in: userId },
    // });

    // // array of promises where we intruct to remove the userId from signatures
    // const updateAllPetitions = everyPetitionSignedByUser.map((e) =>
    //   Petition.findByIdAndUpdate(e._id, { $pull: { signatures: userId } })
    // );

    // // run the promises defined above
    // await Promise.all(updateAllPetitions);

    // const allUpdates = await UpdatePetition.find({parent: })

    // User.findByIdAndDelete(req.session.user._id).then((deletedUser) => {
    //   res.redirect("/");
    // });
});

module.exports = router;
