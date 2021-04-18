const router = require("express").Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

// const parser = require("../config/cloudinary");

const Petition = require("../models/Petition.model");

const User = require("../models/User.model");

router.get("/", (req, res) => {
    Petition.find().then((allPetitions) => {
        console.log("allPetitions", allPetitions);
        res.render("petitions", { petitionList: allPetitions });
    });

    // if (req.session.user) {
    //     Petition.find().then((allPetitions) => {
    //         console.log("allPetitions", allPetitions);
    //         res.render("petitions", { petitionList: allPetitions });
    //     });
    // }
});

router.get("/start-petition", isLoggedIn, (req, res) => {
    res.render("start-petition", { user: req.session.user });
});

router.post("/start-petition", isLoggedIn, (req, res) => {
    const {
        name,
        subject,
        description,
        deadline,
        location,
        signatureTarget,
        image,
    } = req.body;

    Petition.findOne({ name }).then((found) => {
        if (found) {
            return res.render("start-petition", {
                errorMessage: "This petition is already exist.",
            });
        }
    });

    Petition.create({
        name,
        subject,
        description,
        deadline,
        location,
        owner: req.session.user._id,
        signatureTarget,
        // image,
        // signatures: [req.session.user._id],
    })
        .then((createdPetition) => {
            console.log("createdPetition: ", createdPetition);
            // res.redirect(`/petitions/${createdOrganization._id}`);
        })
        .catch((err) => {
            console.log(err);
            // res.render("start-petition", errorMessage);
        });
});

module.exports = router;
