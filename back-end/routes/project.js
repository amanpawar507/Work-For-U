const express = require("express");
const router = express.Router();
const { project } = require("../data");

//-----------------------------------------create---------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    let request = req.body;
    const {
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      createdBy,
      hrsPerDay,
      daysPerWeek,
    } = request;
    if (
      !name ||
      !description ||
      !tenureMonths ||
      !skillsRequired ||
      !hourlyPay ||
      !createdBy ||
      !hrsPerDay ||
      !daysPerWeek
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
      typeof createdBy !== "string" ||
      typeof hrsPerDay !== "number" ||
      typeof daysPerWeek !== "number"
    ) {
      res.status(400).json({ error: "Invalid type of data" });
      return;
    }

    if(
      name.trim().length === 0 ||
      description.trim().length === 0 ||
      createdBy.trim().length === 0 
    ) {
      res.status(400).json({ error: "Empty spaces as input" });
      return;
    }


    if (tenureMonths < 0) {
      res.status(400).json({
        error: "Tenure months should be greater than zero",
      });
      return;
    }
    if (hourlyPay < 0) {
      res.status(400).json({
        error: "Hourly pay should be greater than zero",
      });
      return;
    }
    if (hrsPerDay < 1 || hrsPerDay > 8) {
      res.status(400).json({
        error: "Hours per day should be less than 8 and greater than zero",
      });
      return;
    }

    if (daysPerWeek < 1 || daysPerWeek > 6) {
      res.status(400).json({
        error: "Days per week should be greater than zero and less than 6",
      });
      return;
    }

    let result = await project.createProject({
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      createdBy,
      hrsPerDay,
      daysPerWeek,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage ? error.message : error });
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

    let result = await project.getProject(id);
    res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage });
  }
});

//-----------------------------------------getAll-------------------------------------------------------

router.get("/", async (req, res) => {
  try {
    // if(req.session.email) {
    const projectList = await project.getAll();
    res.json(projectList);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (e) {
    let error = e.toString();
    res.status(500).json({ error: error });
  }
});

//-----------------------------------------updateProject-------------------------------------------------------

router.patch("/:projectId", async (req, res) => {
  try {
    // if(req.session.email) {
    const id = req.params.projectId;

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

    const {
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      hrsPerDay,
      daysPerWeek,
    } = req.body;

    if (
      !name ||
      !description ||
      !tenureMonths ||
      !skillsRequired ||
      !hourlyPay ||
      !hrsPerDay ||
      !daysPerWeek
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
      typeof hrsPerDay !== "number" ||
      typeof daysPerWeek !== "number"
    ) {
      res.status(400).json({ error: "Invalid type of fields" });
      return;
    }

    if(
      name.trim().length === 0 ||
      description.trim().length === 0 
    ) {
      res.status(400).json({ error: "Empty spaces as input" });
      return;
    }

    if (hrsPerDay < 1 || hrsPerDay > 8) {
      res.status(400).json({
        error: "Hours per day should be less than 8 and greater than zero",
      });
      return;
    }

    if (daysPerWeek < 1 || daysPerWeek > 6) {
      res.status(400).json({
        error: "Days per week should be greater than zero and less than 6",
      });
      return;
    }

    const result = await project.updateProject({
      id,
      name,
      description,
      tenureMonths,
      skillsRequired,
      hourlyPay,
      hrsPerDay,
      daysPerWeek,
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "could not update project" });
    }

    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------getAllEmployerProjects-------------------------------------------------------

router.get("/all/employer/:id", async (req, res) => {
  try {
    // if(req.session.email) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "pass an ID" });
      return;
    }
    if (typeof id !== "string") {
      res.status(400).json({ error: "invalid type of ID" });
      return;
    }
    if (id.trim().length === 0) {
      res.status(400).json({ error: "empty spaces for ID" });
      return;
    }
    if(req.headers.user) {
      if(req.headers.user._id !== id) {
        res.status(401).json({ error: "You are not allowed access!" });
        return;
      }
    }


    const result = await project.getAllEmployerProjects(id);
    res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------getAllFreelancerProjects-------------------------------------------------------

router.get("/all/freelancer/:id", async (req, res) => {
  try {
    // if(req.session.email) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "pass an ID" });
      return;
    }
    if (typeof id !== "string") {
      res.status(400).json({ error: "invalid type of ID" });
      return;
    }
    if (id.trim().length === 0) {
      res.status(400).json({ error: "empty spaces for ID" });
      return;
    }
    if(req.headers.user) {
      if(req.headers.user._id !== id) {
        res.status(401).json({ error: "You are not allowed access!" });
        return;
      }
    }


    const result = await project.getAllFreelancerProjects(id);
    res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------getAllFreelancerProjects-------------------------------------------------------

router.post("/requests/add", async (req, res) => {
  try {
    // if(req.session.email) {
    const { freelancerId, projectId } = req.body;
    if (!freelancerId || !projectId) {
      res
        .status(400)
        .json({ error: "Please pass both freelancer ID and project ID" });
      return;
    }
    if (typeof freelancerId !== "string" || typeof projectId !== "string") {
      res.status(400).json({ error: "Invalid type of fields" });
      return;
    }
    if ((freelancerId.trim().length === 0)||(projectId.trim().length === 0)) {
      res.status(400).json({ error: "empty spaces for input" });
      return;
    }

    const result = await project.addRequest(freelancerId, projectId);
    if (result.addedRequest) {
      res.json(result);
    } else {
      res
        .status(500)
        .json({ message: "could not add request for some reason" });
    }
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------getFreelancerRequests-------------------------------------------------------

router.get("/requests/:freelancerId", async (req, res) => {
  try {
    // if(req.session.email) {
    const freelancerId = req.params.freelancerId;

    if (!freelancerId) {
      res.status(400).json({ error: "please pass a freelancer ID" });
      return;
    }

    if (typeof freelancerId !== "string") {
      res.status(400).json({ error: "Invalid type of request" });
      return;
    }

    if (freelancerId.trim().length === 0) {
      res.status(400).json({ error: "empty spaces for input" });
      return;
    }

    if(req.headers.user) {
      if(req.headers.user._id !== freelancerId) {
        res.status(401).json({ error: "You are not allowed access!" });
        return;
      }
    }


    const result = await project.getFreelancerRequests(freelancerId);
    res.json(result);

    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------updateFreelancerRequest-------------------------------------------------------

router.patch("/requests/update", async (req, res) => {
  try {
    // if(req.session.email) {
    const { freelancerId, projectId, status } = req.body;
    console.log(req.body);
    if (!freelancerId || !projectId || !status) {
      res.status(400).json({ error: "please pass all fields" });
      return;
    }

    if (
      typeof freelancerId !== "string" ||
      typeof projectId !== "string" ||
      typeof status !== "string"
    ) {
      res.status(400).json({ error: "Invalid fields" });
      return;
    }

    if(
      freelancerId.trim().length === 0 ||
      projectId.trim().length === 0 
    ) {
      res.status(400).json({ error: "Empty spaces as input" });
      return;
    }

    if(req.headers.user) {
      if(req.headers.user._id !== freelancerId) {
        res.status(401).json({ error: "You are not allowed access!" });
        return;
      }
    }

    const result = await project.updateFreelancerRequest(
      projectId,
      freelancerId,
      status
    );
    res.json(result);

    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------updateProjectStatus-------------------------------------------------------

router.patch("/status/update", async (req, res) => {
  try {
    const { projectId, status } = req.body;
    if (!projectId || !status) {
      res.status(400).json({ error: "Pass all fields" });
      return;
    }
    if (typeof projectId !== "string" || typeof status !== "number") {
      res.status(400).json({ error: "Invalid type of fields" });
      return;
    }
    if ((projectId.trim().length === 0)
    ) {
      res.status(400).json({ error: "empty spaces for input" });
      return;
    }

    const result = await project.updateProjectStatus(projectId, status);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------deleteProject-------------------------------------------------------

router.delete("/:id", async (req, res) => {
  try {
    // if(req.session.email) {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Please pass a projectID" });
      return;
    }
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    if (id.trim().length === 0) {
      res.status(400).json({ error: "empty spaces for ID" });
      return;
    }

    const result = await project.deleteProject(id);
    if (result.deleted) {
      res.json(result);
    }

    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.message : error });
  }
});

//-----------------------------------------filterProject-------------------------------------------------------

router.get("/filter/:userType/:userId/:query/:type", async (req, res) => {
  try {
    // if(req.session.email) {
    const obj = req.params; //{query,filterkey}
    // const id = req.params.id;
    if (!obj.query || !obj.userType || !obj.userId) {
      res.status(400).json({ error: "Please provide all the details" });
      return;
    }
    if (
      typeof obj.query !== "string" ||
      typeof obj.userType !== "string" ||
      typeof obj.userId !== "string"
    ) {
      res.status(400).json({ error: "Invalid type of input object" });
      return;
    }
    if (
      obj.query.trim().length === 0 ||
      obj.userType.trim().length === 0 ||
      obj.userId.trim().length === 0
    ) {
      res.status(400).json({ error: "empty spaces for input object" });
      return;
    }

    let result = await project.filterProject(obj);
    res.json(result);
    // }else{
    //   res.status(401).json({message: "unauthorized access!"});
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.messsage ? error.message : error });
  }
});

module.exports = router;
