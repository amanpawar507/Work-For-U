const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { freelancer } = require("../data");
const data = require("../data");
const {generateToken} = require("../middlewares/JWT");
const employerData = data.employer;

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

    if(skills.length === 0) {
      res.status(400).json({ error: "Select atleast one skill" });
      return;
    }

    if(
      fullName.trim().length === 0 ||
      emailId.trim().length === 0 ||
      password.length === 0 ||
      location.trim().length === 0 
    ) {
      res.status(400).json({ error: "Empty spaces as input" });
      return;
    }


    if(password.length < 6) res.status(400).json({error: "Password should be atleast 6 characters!"});

    let resultF = await freelancer.createFreelancer(req.body);
    res.json(resultF);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage ? error.message : error });
  }
});

//-----------------------------------------getAll---------------------------------------------------------

router.get("/all", async (req, res) => {
    try {
      // console.log(req.session.email);
      // if(req.session.email) {
        console.log('headers: ', req.headers.user);
        const freelancerList = await freelancer.getAll(req.headers.user._id);
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
    res.status(500).json({ error: error.messsage ? error.message: error });
  }
});

//-----------------------------------------getonbasisofNameOrSkill---------------------------------------------------------

router.post("/searchFreelancer", async (req, res) => {
  try {
    // if(req.session.email) {
      const obj = req.body; //{query,filterkey}
      // const id = req.params.id;
      if (!obj.query ) {
        res.status(400).json({ error: "Please provide all the details" });
        return;
      }
      if (typeof obj.query !== "string") {
        res.status(400).json({ error: "Invalid type of input object" });
        return;
      }
      if (obj.query.trim().length === 0 ) {
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
    console.log(error.message);
    res.status(500).json({ error: error.messsage ? error.message : error });
  }
})


//----------------------------------------delete------------------------------------------------

router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
      if(!id) {
        res.status(400).json({error: "Please provide an freelancerId"});
        return;
      }
      if(typeof id !== "string") {
        res.status(400).json({error: "Invalid type of freelancerId"});
        return;
      }
      if(id.trim().length === 0) {
        res.status(400).json({error: "Just empty spaces"});
        return;
      }
    const freelancer = await freelancer.remove(id);
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
    if(emailId.trim().length === 0 ||password.length === 0) {
      res.status(400).json({ error: "Empty spaces as input" });
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

//---------------------------------------Blacklisting------------------------------------------------

router.post("/blacklist", async (req, res) => {
  try {
    const { freelancerID, EmployerID } = req.body;

    if (!freelancerID || !EmployerID) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (typeof freelancerID !== "string" || typeof EmployerID !== "string") {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }
    if(freelancerID.trim().length === 0 || EmployerID.trim().length === 0) {
      res.status(400).json({error: "Just empty spaces"});
      return;
    }

    let result = await freelancer.Blacklist(freelancerID,EmployerID);
    res.json(result);
    
  } catch (error) {
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage ? error.message : error});
  }
});

//---------------------------------------BlacklistDelete------------------------------------------------

router.delete("/blacklist/:freelancerID/:EmployerID", async (req, res) => {
  try {
    const { freelancerID, EmployerID } = req.params;

    if (!freelancerID || !EmployerID) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (typeof freelancerID !== "string" || typeof EmployerID !== "string") {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }
    if(freelancerID.trim().length === 0 || EmployerID.trim().length === 0) {
      res.status(400).json({error: "Just empty spaces"});
      return;
    }

    let result = await freelancer.Blacklistremove(freelancerID,EmployerID);
    res.json(result);
    
  } catch (error) {
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage ? error.message : error});
  }
});

//---------------------------------------SuccessRate------------------------------------------------

router.get("/successRate/:freelancerId", async(req,res) => {
  try {
    const freelancerId = req.params.freelancerId;
    if(!freelancerId) {
      res.status(400).json({error: "Pass a freelancerId"});
      return;
    }
    if(typeof freelancerId !== "string") {
      res.status(400).json({error: "Invalid type of freelancer Id"});
      return;
    }

    let result = await freelancer.getSuccessRate(freelancerId);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage ? error.message : error});
  }
})


//--------------------------------------EditProfile--------------------------------------------------

router.patch("/edit", async (req, res) => {
  try {
    const { id,fullName, introduction, skills, location, expectedPay } = req.body;
    if (!id || !fullName   || !skills || !introduction || !location  || !expectedPay) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    
    if (
      typeof id !== "string" ||
      typeof fullName !== "string" ||
      typeof introduction !== "string" ||
      (typeof skills !== "object" && !skills.length) ||
      typeof location !== "string" ||
      typeof expectedPay !== "number"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let editedprofile = await freelancer.editProfile(req.body);
    res.status(200).json(editedprofile);

  } catch (error) {
    console.log("from data: ", error);
    res.status(400).json({ error: error.messsage ? error.message : error });
  }
});

//-------------------------------------logout-----------------------------------------------

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.json({loggedOut: true})
});
module.exports = router;
