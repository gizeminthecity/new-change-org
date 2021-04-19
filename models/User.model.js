const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        max: 500,
    },
    profilePic: {
        type: String,
    },
    website: {
        type: String,
    },
});

const User = model("User", userSchema);

module.exports = User;
