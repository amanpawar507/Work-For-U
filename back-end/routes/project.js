const express = require("express");
const router = express.Router();
const { project } = require("../data");

router.post("/", async (req, res) => {
  try {
    let request = req.body;
    const {
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      status,
      createdBy,
    } = request;
    if (
      !name ||
      !description ||
      !tenureMonths ||
      !skillsRequired ||
      !hourlyPay ||
      !status ||
      !createdBy
    ) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof tenureMonths !== "number" ||
      (typeof skillsRequired !== "object" && !skillsRequired.length) ||
      typeof hourlyPay !== "number" ||
      typeof status !== "number" ||
      typeof createdBy !== "string"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }
    module.exports = router;
    let result = await project.createProject(
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      status,
      createdBy
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
});


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

        let result = await project.getProject(id);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.messsage});
    }
})


module.exports = router;
