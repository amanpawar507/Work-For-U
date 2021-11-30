const express = require("express");
// const { freelancer } = require("../config/mongoCollections");
const router = express.Router();
const { employer } = require("../data");
const { route } = require("./project");


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

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if(!id) {
      res.status(400).json({error: "please provide an Id"});
      return;
    }
    
    if(typeof id !== "string") {
      res.status(400).json({error: "Invalid ID"})
      return;
    }

    let result = await employer.getEmployer(id);
    res.json(result);

  } catch (error) {
    console.log('from data: ', error);
    res.status(500).json({ error: error.messsage });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } =
      req.body;

    if (
      !emailId ||
      !password 
        ) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (
      typeof emailId !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    let verifyUser = await employer.checker(req.body);
    res.json(verifyUser);
  } catch (error) {
    console.log('from data: ', error);
    res.status(500).json({ error: error.messsage });
  }
});


router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('../login');
})

module.exports = router;
