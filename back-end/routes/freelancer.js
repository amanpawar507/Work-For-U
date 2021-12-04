const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { freelancer } = require("../data");
const data = require("../data");
const {generateToken} = require("../middlewares/JWT");
const freelancerData = data.employer;

//-----------------------------------------create---------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      password,
      introduction,
      skills,
      location,
      expectedPay,
    } = req.body;

    if (
      !fullName ||
      !emailId ||
      !password ||
      !introduction ||
      !skills ||
      !location ||
      !expectedPay
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
      typeof location !== "string" ||
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

router.get("/all", async (req, res) => {
    try {
      // console.log(req.session.email);
      // if(req.session.email) {
        const freelancerList = await freelancer.getAll();
        res.json(freelancerList);
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
  } catch (e) {
    let error = e.toString();
    res.status(500).json({ error: error });
  }
});

//-----------------------------------------get---------------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    // if(req.session.email) {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Please provide an ID" });
        return;
      }
      if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid type of ID" });
        return;
      }
      if (id.trim().length === 0) {
        res.status(400).json({ error: "empty spaces for ID" });
        return;
      }
  
      let result = await freelancer.getFreelancer(id);
      res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
});

//-----------------------------------------getonbasisofNameOrSkill---------------------------------------------------------

router.post("/searchFreelancer", async (req, res) => {
  try {
    // if(req.session.email) {
      const obj = req.body; //{query,filterkey}
      // const id = req.params.id;
      if (!obj.query || !obj.filterkey) {
        res.status(400).json({ error: "Please provide all the details" });
        return;
      }
      if (typeof obj.query !== "string" || typeof obj.filterkey !== "string") {
        res.status(400).json({ error: "Invalid type of input object" });
        return;
      }
      if (obj.query.trim().length === 0 || obj.filterkey.trim().length === 0) {
        res.status(400).json({ error: "empty spaces for input object" });
        return;
      }
  
      let result = await freelancer.searchType(obj);
      res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
});

//-------------------------------------get recommended freelancer-----------------------------------------------

router.get("/recommended/:id", async(req,res) => {
  try {
    // if(req.session.email) {
      const id = req.params.id;
      if(!id) {
        res.status(400).json({error: "Please provide an employerId"});
        return;
      }
      if(typeof id !== "string") {
        res.status(400).json({error: "Invalid type of employerId"});
        return;
      }
      if(id.trim().length === 0) {
        res.status(400).json({error: "Just empty spaces"});
        return;
      }
      const recommendations = await freelancer.getRecommended(id);
      res.json(recommendations);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
})


//----------------------------------------delete------------------------------------------------

router.get("/delete/:id", async (req, res) => {
  try {
    const freelancer = await freelancerData.remove(req.params.id);
    res.redirect("/login/");
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "There is no freelancer with that ID" });
  }
});
//---------------------------------------login------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (typeof emailId !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let verifyUser = await freelancer.checker(emailId, password);
    let token = generateToken(verifyUser);
    res.json({token: token,user: verifyUser});
  } catch (error) {
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage ? error.message : error});
  }
});



//-------------------------------------logout-----------------------------------------------
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.json({loggedOut: true})
});
module.exports = router;
