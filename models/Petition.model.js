const mongoose = require("mongoose");
const SUBJECT_ENUM = require("../utils/consts");

const petitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
        enum: SUBJECT_ENUM,
    },
    description: {
        type: String,
        required: true,
        min: 30,
    },
    deadline: Date,
    signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    signatureTarget: {
        type: Number,
    },
    image: {
        type: String,
        // required: true,
        default:
            "https://res.cloudinary.com/gizemella/image/upload/v1619017349/hqdefault_s2fove.jpg",
    },
});

const Petition = mongoose.model("Petition", petitionSchema);

module.exports = Petition;
