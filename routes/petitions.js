const express = require("express");
const Petition = require("../models/Petition.model");

const router = require("express").Router();

router.get("/", (req, res) => {
  Petition.find().then((allPetitions) => {
    console.log("allPetitions: ", allPetitions[0]);
    res.render("petitions", {
      petitionList: allPetitions,
    });
  });
});
module.exports = router;
