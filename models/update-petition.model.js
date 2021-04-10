const mongoose = require("mongoose");

const updatePeititionSchema = new mongoose.Schema({
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
});

const updatePetition = mongoose.model("updatePetition", updatePeititionSchema);

module.exports = updatePetition;

//test test test
