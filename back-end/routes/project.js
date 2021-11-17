const express = require('express');
const router = express.Router();
const {project} = require('../data');

router.post('/',async(req,res) => {
    try {
        let request = req.body;
        const {name, description, tenureMonths, skillsRequired, hourlyPay, status, createdBy} = request;
        if(!name || !description || !tenureMonths || !skillsRequired || !hourlyPay || !status || !createdBy) {
            res.status(400).json({error: "Missing fields"});
            return;
        }
        if(
            typeof name !== "string" || 
            typeof description !== "string" || 
            typeof tenureMonths !== "number" || 
            (typeof skillsRequired !== "object" && !skillsRequired.length) || 
            typeof hourlyPay !== "number" || 
            typeof status !== "number" || 
            typeof createdBy !== "string" 
        ) {
            res.status(400).json({error: "Invalid type of data"});
            return;
        }

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
        res.status(500).json({error: error.messsage});
    }
})


//-----------------------------------------getAll-------------------------------------------------------

router.get('projects/', async (req, res) => {
  
    try {
      const projectList = await project.getAll();
      res.json(projectList);
    } catch (e) {
      let error = e.toString();
      res.status(500).json({ "error": error });
    }
  });

//------------------------------------------get------------------------------------------------------

router.get('projects/:id', async (req, res) => {
  try {
    const project = await project.get(req.params.id);
    res.status(200).json(project);
  } catch (e) {
    let error = e.toString();
    res.status(404).json({"error": error});
  }
});

module.exports = router;