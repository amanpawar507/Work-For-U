const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { freelancer } = require("../data");

//-----------------------------------------create---------------------------------------------------------

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

//-----------------------------------------getAll---------------------------------------------------------

router.get('/', async (req, res) => {
  
  try {
    const freelancerList = await freelancer.getAll();
    res.json(freelancerList);
  } catch (e) {
    let error = e.toString();
    res.status(500).json({ "error": error });
  }
});


//-----------------------------------------get---------------------------------------------------------

router.get('/:id', async (req,res) => {
  try {
      const id = req.params.id;
      if(!id) {
          res.status(400).json({error: "Please provide an ID"});
          return;
      }
      if(typeof id !== "string") {
          res.status(400).json({error: "Invalid type of ID"});
          return;
      }
      if(id.trim().length === 0) {
          res.status(400).json({error: "empty spaces for ID"});
          return;
      }

      let result = await freelancer.getFreelancer(id);
      res.json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({error: error.messsage});
  }
})

//-----------------------------------------getonbasisofNameOrSkill---------------------------------------------------------

router.get('/searchFreelancer/', async (req,res) => {
  try {
      const obj = req.body //{query,filterkey}
      // const id = req.params.id;
      if(!obj.query || !obj.filterkey) {
          res.status(400).json({error: "Please provide all the details"});
          return;
      }
      if(typeof(obj.query) !== "string" || typeof(obj.filterkey) !== "string") {
          res.status(400).json({error: "Invalid type of input object"});
          return;
      }
      if((obj.query).trim().length === 0 || (obj.filterkey).trim().length === 0) {
          res.status(400).json({error: "empty spaces for input object"});
          return;
      }

      let result = await freelancer.searchType(obj);
      res.json(result);
  } catch (error) {
      console.log(error);
      res.status(500).json({error: error.messsage});
  }
})

module.exports = router;
