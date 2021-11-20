const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { freelancer } = require("../data");

router.post("/create_freelancer", async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      password,
      introduction,
      skills,
      projects,
      overallRating,
      reviews,
      location,
      successRate,
      expectedPay,
      createdAt,
    } = req.body;

    if (
      !fullName ||
      !emailId ||
      !password ||
      !introduction ||
      !skills ||
      !projects ||
      !overallRating ||
      !reviews ||
      !location ||
      !successRate ||
      !expectedPay ||
      !createdAt
    ) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (
      typeof fullName !== "string" ||
      typeof emailId !== "string" ||
      typeof password !== "string" ||
      typeof introduction !== "string" ||
      (typeof skills !== "object" && !skills.length) ||
      //(Array.isArray(skills) && !skills.length) ||
      (Array.isArray(projects) && !projects.length) ||
      typeof overallRating !== "number" ||
      (Array.isArray(reviews) && !reviews.length) ||
      typeof location !== "string" ||
      typeof successRate !== "number" ||
      typeof expectedPay !== "number"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let resultF = await freelancer.createFreelancer(req.body);
    res.json(resultF);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
});

module.exports = router;
