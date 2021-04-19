const router = require("express").Router();
const SUBJECT_ENUM = require("../utils/consts");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Petition = require("../models/Petition.model");
const User = require("../models/User.model");
const UpdatePetition = require("../models/UpdatePetition.model");

// const parser = require("../config/cloudinary");

router.get("/my-petitions", isLoggedIn, (req, res) => {
    Petition.find({ owner: req.session.user._id }).then((myPetitions) => {
        Petition.find({
            $and: [
                { owner: { $ne: req.session.user._id } },
                { signatures: { $in: req.session.user._id } },
            ],
        })
            .then((signedPetitions) => {
                console.log("owner: ", myPetitions);
                console.log("signedPetitions: ", signedPetitions);
                res.render("my-petitions", {
                    owner: myPetitions,
                    signatures: signedPetitions,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

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
            // res.redirect(`/petitions/${createdPetition._id}`);
        })
        .catch((err) => {
            console.log(err);
            res.render("start-petition", {
                errorMessage: "Something went wrong",
            });
        });
});

router.get("/:_id", isLoggedIn, (req, res) => {
    Promise.all([
        UpdatePetition.find({ parent: req.params._id }), // 0
        Petition.findById(req.params._id) // 1
            .populate("owner")
            .populate("signatures"),
    ])
        .then((results) => {
            const allUpdates = results[0];
            console.log("allUpdates:", allUpdates);
            const foundPetition = results[1];
            if (!foundPetition) {
                return res.redirect(`/`);
            }
            let isOwner = false;
            if (req.session.user) {
                if (
                    foundPetition.owner.username === req.session.user.username
                ) {
                    isOwner = true;
                }
            }
            res.render("single-petition", {
                petition: foundPetition,
                isOwner,
                updateList: allUpdates,
            });
        })
        .catch((err) => {
            res.redirect("/");
        });
});

router.post("/:_id", isLoggedIn, (req, res) => {
    // console.log("HELLO: ", req);
    const { title, description, image } = req.body;

    UpdatePetition.create({
        title,
        description,
        image,
        parent: req.params._id,
    })
        .then((createdUpdate) => {
            console.log("createdUpdate: ", createdUpdate);
            res.redirect(`/petitions/${req.params._id}`);
        })
        .catch((err) => {
            console.log(err.message);
            res.render("single-petition", {
                errorMessage: "Something went wrong",
            });
        });
});

router.get("/:_id/delete", isLoggedIn, (req, res) => {
    Petition.findById(req.param._id)
        .populate("owner")
        .then((foundPetition) => {
            console.log("foundPtition: ", foundPetition);
            if (!petition) {
                return res.redirect(`/`);
            }
        });

    Petition.findByIdAndDelete(foundPetition._id).then(() => {
        res.redirect("/my-petitions");
    });
});

module.exports = router;
