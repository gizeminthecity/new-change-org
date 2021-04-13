const { Schema, model } = require("mongoose");

const petitionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        min: 10,
        max: 200,
        required: true,
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
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    signatureTarget: {
        type: Number,
    },
    picture: {
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
