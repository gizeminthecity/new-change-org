const { Schema, model } = require("mongoose");
const SUBJECT_ENUM = require("../utils/consts");

const petitionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        // required: true,
        enum: SUBJECT_ENUM,
    },
    description: {
        type: String,
        required: true,
        min: 30,
    },
    deadline: Date,
    signatures: [{ type: Schema.Types.ObjectId, ref: "User" }],
    location: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    signatureTarget: {
        type: Number,
    },
    image: {
        type: String,
        default: "",
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
});

const Petition = model("Petition", petitionSchema);

module.exports = Petition;
