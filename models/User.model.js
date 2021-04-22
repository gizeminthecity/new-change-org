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
    image: {
        type: String,
        default:
            "https://res.cloudinary.com/gizemella/image/upload/v1619017349/hqdefault_s2fove.jpg",
    },
    website: {
        type: String,
    },
});

const User = model("User", userSchema);

module.exports = User;
