const mongoose = require("mongoose");

const updatePetitionSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    date: Date,
    title: {
        type: String,
        required: true,
        min: 15,
        max: 200,
    },
    description: {
        type: String,
        required: true,
        min: 50,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Petition",
    },
});

const UpdatePetition = mongoose.model("UpdatePetition", updatePetitionSchema);

module.exports = UpdatePetition;
