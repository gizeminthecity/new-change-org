const router = require("express").Router();
const SUBJECT_ENUM = require("../utils/consts");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Petition = require("../models/Petition.model");
const User = require("../models/User.model");
const UpdatePetition = require("../models/UpdatePetition.model");
const parser = require("../config/cloudinary");

router.get("/my-petitions", isLoggedIn, (req, res) => {
    Petition.find({ owner: req.session.user._id }).then((myPetitions) => {
        Petition.find({
            $and: [
                { owner: { $ne: req.session.user._id } },
                { signatures: { $in: req.session.user._id } },
            ],
        })
            .then((signedPetitions) => {
                // console.log("owner: ", myPetitions);
                // console.log("signedPetitions: ", signedPetitions);
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
        res.render("petitions", { petitionList: allPetitions });
    });
});

router.get("/start-petition", isLoggedIn, (req, res) => {
    res.render("start-petition", {
        subjects: SUBJECT_ENUM,
        user: req.session.user,
    });
});

router.post(
    "/start-petition",
    isLoggedIn,
    parser.single("image"),
    (req, res) => {
        const image = req.file?.path;
        const {
            name,
            subject,
            description,
            deadline,
            location,
            signatureTarget,
        } = req.body;

        Petition.findOne({ name }).then((found) => {
            if (found) {
                return res.render("start-petition", {
                    errorMessage: "This petition is already exist.",
                });
            }
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
                    res.redirect(`/petitions/${createdPetition._id}`);
                })
                .catch((err) => {
                    console.log(err);
                    res.render("start-petition", {
                        errorMessage: "Something went wrong",
                    });
                });
        });
    }
);

router.get("/:_id", isLoggedIn, (req, res) => {
    Promise.all([
        UpdatePetition.find({ parent: req.params._id }), // 0
        Petition.findById(req.params._id) // 1
            .populate("owner")
            .populate("signatures"),
    ])
        .then((results) => {
            const allUpdates = results[0];
            const foundPetition = results[1];
            if (!foundPetition) {
                return res.redirect(`/`);
            }
            let signatureIdsArray = foundPetition.signatures;
            const signatureIds = signatureIdsArray.map((el) => el.username);

            let isSignedAlready;
            if (req.session.user) {
                if (signatureIds.includes(req.session.user.username)) {
                    isSignedAlready = true;
                }
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
                isSignedAlready,
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
    const { title, description, image } = req.body;

    UpdatePetition.create({
        title,
        description,
        image,
        parent: req.params._id,
    })
        .then((createdUpdate) => {
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
    Petition.findById(req.params._id)
        .populate("owner")
        .then((foundPetition) => {
            if (!foundPetition) {
                return res.redirect(`/`);
            }
            if (
                !foundPetition.owner._id.toString() ===
                req.session.user._id.toString()
            ) {
                return res.redirect(`/`);
            }
            const deletePetition = Petition.findByIdAndDelete(
                foundPetition._id
            );
            const deleteUpdates = UpdatePetition.findByIdAndUpdate(
                foundPetition.parent._id,
                {
                    $pull: { updates: foundPetition.parent._id },
                }
            );

            Promise.all([deletePetition, deleteUpdates])
                .then(() => {
                    res.redirect("/");
                })
                .catch((err) => console.log(err));
        });
});

router.get("/:_id/sign", isLoggedIn, (req, res) => {
    return Petition.findByIdAndUpdate(
        req.params._id,
        {
            $addToSet: { signatures: req.session.user._id },
        },
        { new: true }
    )
        .then((returnedPetition) => {
            let isSigning = false;

            if (returnedPetition.signatures.includes(req.session.user._id)) {
                isSigning = true;
            }
            res.render("single-petition", {
                isSigning,
                returnedPetition: returnedPetition,
            });
        })
        .catch((err) => console.log(err));
});

router.get("/:_id/remove", isLoggedIn, (req, res) => {
    return Petition.findByIdAndUpdate(
        req.params._id,
        {
            $pull: { signatures: req.session.user._id },
        },
        { new: true }
    )
        .then((removedSignature) => {
            console.log("foundPetition: ", removedSignature);
            let isRemoved = false;

            if (!removedSignature.signatures.includes(req.session.user._id)) {
                isRemoved = true;
                console.log(isRemoved);
            }
            res.render("single-petition", { isRemoved });
        })
        .catch((err) => console.log(err));
});

module.exports = router;
