const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { employer } = require("../data");
const { route } = require("./project");
const data = require("../data");
const e = require("express");
const {generateToken} = require("../middlewares/JWT");
const { listemployer } = require("../data/employer");
const employerData = data.employer;

//--------------------------------------Create Employer--------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const { fullName, emailId, password, companyName } = req.body;

    if (!fullName || !emailId || !password || !companyName) {
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
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage });
  }
});

//--------------------------------------Get Employer--------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    //if(req.session.email) {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "please provide an Id" });
        return;
      }
  
      if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }
  
      let result = await employer.getEmployer(id);
      res.json(result);
    //}else{
      //res.status(401).json({message: "unauthorized access!"});
    //}
  } catch (error) {
    console.log("from data: ", error);
    res.status(500).json({ error: error.messsage });
  }
});

//--------------------------------------DeleteEmployer--------------------------------------------------

router.get("/delete/:id", async (req, res) => {
  try {
    const employer = await employerData.remove(req.params.id);
    res.redirect("/login/");
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "There is no employer with that ID" });
  }
});

//--------------------------------------VerifyUser--------------------------------------------------

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

    let verifyUser = await employer.checker(emailId,password);

    const token = generateToken(verifyUser);
    console.log(token);
    res.json({token: token,user: verifyUser});
  } catch (error) {
    console.log("from data: ", error);
    res.status(400).json({ error: error.messsage ? error.message : error });
  }
});

//--------------------------------------getlistofAllemployers--------------------------------------------------

router.post("/getList", async (req, res) => {
  try {
    const { employeridarr } = req.body;
    if(!employeridarr){
      throw "Please provide an input";
    }
    if(!Array.isArray(employeridarr)){
      throw "Please provide input as an array"
    }
    if(employeridarr.length === 0){
      throw "Provide a list of employer ids";
    }

    let list = await listemployer(employeridarr);
    res.status(200).json(list);

  } catch (error) {
    console.log("from data: ", error);
    res.status(400).json({ error: error.messsage ? error.message : error });
  }
});

//--------------------------------------EditProfile--------------------------------------------------

router.patch("/edit", async (req, res) => {
  try {
    const { id,fullName, companyName } = req.body;
    if (!id || !fullName  || !companyName) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (
      typeof id !== "string" ||
      typeof fullName !== "string" ||
      typeof companyName !== "string"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let editedprofile = await employerData.editProfile(req.body);
    res.status(200).json(editedprofile);

  } catch (error) {
    console.log("from data: ", error);
    res.status(400).json({ error: error.messsage ? error.message : error });
  }
});
//--------------------------------------Logout--------------------------------------------------

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.json({loggedOut: true})
});

module.exports = router;
