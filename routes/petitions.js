const router = require("express").Router();
const SUBJECT_ENUM = require("../utils/consts");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Petition = require("../models/Petition.model");
const User = require("../models/User.model");

// const parser = require("../config/cloudinary");

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
    res.render("start-petition", {
        subjects: SUBJECT_ENUM,
        user: req.session.user,
    });
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
        signatureTarget,
        owner: req.session.user._id,
        signatures: [req.session.user._id],
        image,
    })
        .then((createdPetition) => {
            console.log("createdPetition: ", createdPetition);
            res.redirect(`/petitions/${createdPetition._id}`);
        })
        .catch((err) => {
            console.log(err);
            res.render("start-petition", {
                errorMessage: "Something went wrong",
            });
        });
});

router.get("/:_id", (req, res) => {
    Petition.findById(req.params._id).then((foundPetition) => {
        if (!foundPetition) {
            return res.redirect(`/`);
        }
        res.render("single-petition", { petition: foundPetition });
    });
});

module.exports = router;
