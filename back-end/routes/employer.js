const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { employer } = require("../data");

router.post("/", async (req, res) => {
  try {
    const { fullName, emailId, password, companyName } =
      req.body;

    if (
      !fullName ||
      !emailId ||
      !password ||
      !companyName 
    ) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (
      typeof fullName !== "string" ||
      typeof emailId !== "string" ||
      typeof password !== "string" ||
      typeof companyName !== "string" 
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let resultE = await employer.createEmployer(req.body);
    res.json(resultE);
  } catch (error) {
    console.log('from data: ', error);
    res.status(500).json({ error: error.messsage });
  }
});

module.exports = router;
