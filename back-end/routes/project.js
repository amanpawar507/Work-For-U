const express = require("express");
const router = express.Router();
const { project } = require("../data");

//-----------------------------------------create---------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    if(req.session.email) {
      let request = req.body;
    const {
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      createdBy,
    } = request;
    if (
      !name ||
      !description ||
      !tenureMonths ||
      !skillsRequired ||
      !hourlyPay ||
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
      typeof createdBy !== "string"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }
    let result = await project.createProject(
      {name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      createdBy}
    );
    res.json(result);
    }else{
      res.status(401).json({message: "unauthorized access!"});
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage? error.message : error });
  }
});

//-----------------------------------------get---------------------------------------------------------

router.get('/:id', async (req,res) => {
    try {
      // if(req.session.email) {
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
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
       
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.messsage});
    }
})


//-----------------------------------------getAll-------------------------------------------------------

router.get('/', async (req, res) => {
  
    try {
      // if(req.session.email) {
        const projectList = await project.getAll();
      res.json(projectList);
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
       
      
    } catch (e) {
      let error = e.toString();
      res.status(500).json({ "error": error });
    }
  });


  //-----------------------------------------updateProject-------------------------------------------------------

  router.patch('/:projectId', async(req, res) => {
    try {
      // if(req.session.email) {
        const id = req.params.projectId;
        const {
        name,
        description,
        tenureMonths,
        skillsRequired,
        hourlyPay
        } = req.body;
  
        if(
          !name ||
          !description ||
          !tenureMonths ||
          !skillsRequired ||
          !hourlyPay 
        ) {
          res.status(400).json({error: "Missing fields"});
          return;
        }
      
        if(
          typeof name !== "string" ||
          typeof description !== "string" ||
          typeof tenureMonths !== "number" ||
          (typeof skillsRequired !== "object" && !skillsRequired.length ) ||
          typeof hourlyPay !== "number" 
        ) {
          res.status(400).json({error: "Invalid type of fields"});
          return;
        }
  
        const result = await project.updateProject({
          id,
          name,
          description,
          tenureMonths,
          skillsRequired,
          hourlyPay
        });
        
        if(result) {
          res.status(200).json(result);
        }else{
          res.status(500).json({error: "could not update project"});
        }
  
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
     
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.get("/all/employer/:id", async(req,res) => {
    try {
      // if(req.session.email) {
        const id = req.params.id;
      if(!id) {
        res.status(400).json({error: "pass an ID"});
        return;
      }
      if(typeof id !== "string") {
        res.status(400).json({error: "invalid type of ID"});
        return;
      }

      const result = await project.getAllEmployerProjects(id);
      res.json(result);
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.get("/all/freelancer/:id", async(req,res) => {
    try {
      // if(req.session.email) {
        const id = req.params.id;
        if(!id) {
          res.status(400).json({error: "pass an ID"});
          return;
        }
        if(typeof id !== "string") {
          res.status(400).json({error: "invalid type of ID"});
          return;
        }
  
        const result = await project.getAllFreelancerProjects(id);
        res.json(result);
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
     
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.post("/requests/add", async (req,res) => {
    try {
      // if(req.session.email) {
        const {freelancerId, projectId} = req.body;
      if(!freelancerId || !projectId) {
        res.status(400).json({error: "Please pass both freelancer ID and project ID"});
        return;
      }
      if(typeof freelancerId !== "string" || typeof projectId !== "string") {
        res.status(400).json({error: "Invalid type of fields"});
        return;
      }

      const result = await project.addRequest(freelancerId,projectId);
      if(result.addedRequest) {
        res.json(result);
      }else{
        res.status(500).json({message: "could not add request for some reason"});
      }
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
     
     
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.get("/requests/:freelancerId", async (req,res) => {
    try {
      // if(req.session.email) {
        const freelancerId = req.params.freelancerId;

        if(!freelancerId) {
          res.status(400).json({error: "please pass a freelancer ID"});
          return;
        }
  
        if(typeof freelancerId !== "string") {
          res.status(400).json({error: "Invalid type of request"});
          return;
        }
  
        const result = await project.getFreelancerRequests(freelancerId);
        res.json(result);
  
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.patch("/requests/update", async (req,res) => {
    try {
      // if(req.session.email) {
        const {freelancerId, projectId, status} = req.body;
        console.log(req.body);
        if(!freelancerId || !projectId || (!status && status !== 0)) {
          res.status(400).json({error: "please pass all fields"});
          return;
        }
  
        if(typeof freelancerId !== "string" || typeof projectId !== "string" || typeof status !== "number") {
          res.status(400).json({error: "Invalid fields"});
          return;
        }
  
        if(status < 0 || status > 3) {
          res.status(400).json({error: "Invalid status"});
          return;
        }
  
        const result = await project.updateFreelancerRequest(projectId, freelancerId, status);
        res.json(result);
  
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

  router.delete("/:id", async (req,res) => {
    try {
      // if(req.session.email) {
        const id = req.params.id;
        if(!id) {
          res.status(400).json({error: "Please pass a projectID"});
          return;
        }
        if(typeof id !== "string") {
          res.status(400).json({error: "Invalid ID"});
          return;
        }
  
        const result = await project.deleteProject(id);
        if(result.deleted) {
          res.json(result);
        }
  
      // }else{
      //   res.status(401).json({message: "unauthorized access!"});
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message ? error.message : error});
    }
  })

module.exports = router;
