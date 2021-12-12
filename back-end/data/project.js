const { project, freelancer } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
const { getFreelancer, getSuccessRate } = require("./freelancer");
const { ObjectId } = require("mongodb");
var addMonths = require("date-fns/addMonths");

const getCurrentTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

//-----------------------------------------get---------------------------------------------------------

const getProject = async (projectId) => {
  if (!projectId) throw "provide a project ID to fetch";
  if (typeof projectId !== "string") throw "Invalid project ID";
  if (!ObjectId.isValid(projectId.trim())) throw "Please provide a valid objectID.";

  const objId = ObjectId(projectId.trim());

  const projectCollection = await project();
  let foundEntry = await projectCollection.findOne({ _id: objId });
  if (!foundEntry) throw "could not find project for the given ID";

  return {
    _id: foundEntry._id.toString(),
    ...foundEntry,
  };
};

//-----------------------------------------create---------------------------------------------------------

const createProject = async (data) => {
  const {
    name,
    description,
    tenureMonths,
    skillsRequired,
    hourlyPay,
    createdBy,
    hrsPerDay,
    daysPerWeek,
  } = data;
  if (
    !name ||
    !description ||
    !tenureMonths ||
    !skillsRequired ||
    !hourlyPay ||
    !createdBy ||
    !hrsPerDay ||
    !daysPerWeek
  )
    throw "Missing fields";
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof tenureMonths !== "number" ||
    (typeof skillsRequired !== "object" && !skillsRequired.length) ||
    typeof hourlyPay !== "number" ||
    typeof createdBy !== "string" ||
    typeof hrsPerDay !== "number" ||
    typeof daysPerWeek !== "number"
  )
    throw "Invalid type of data";
  
  if (
    name.trim().length === 0 ||
    description.trim().length === 0 ||
    createdBy.trim().length === 0 
  ) {
    throw "Empty spaces as input";
  }

  if (tenureMonths < 0) throw "Tenure months should be greater than zero";
  if (hourlyPay < 0) throw "Hourly pay should be greater than zero";
  if (hrsPerDay < 1 || hrsPerDay > 8)
    throw "Hours per day should be less than 8 and greater than zero";
  if (daysPerWeek < 1 || daysPerWeek > 6)
    throw "Days per week should be greater than zero and less than 6";

  let skillsArray = await getSkill(skillsRequired);

  const projectCollection = await project();

  const newEntry = {
    name,
    description,
    tenureMonths,
    skillsRequired: skillsArray,
    requested: [],
    hourlyPay,
    status: 0,
    createdBy,
    assignedTo: null,
    createdAt: getCurrentTime(),
    reviewed:false,
    hrsPerDay,
    daysPerWeek,
  };

  let addedEntry = await projectCollection.insertOne(newEntry);
  if (addedEntry.insertedCount === 0) throw "The project couldn't be created";

  let newEntryInfo = await projectCollection.findOne({
    _id: addedEntry.insertedId,
  });
  if (!newEntryInfo) throw "Could not find the created project";

  return {
    _id: newEntryInfo._id.toString(),
    ...newEntryInfo,
  };
};

//-----------------------------------------getAll-------------------------------------------------------

const getAll = async () => {
  //Exceptions
  // if (arguments.length != 0) throw `No parameter required`;

  const projectCollection = await project();
  const projectList = await projectCollection.find({}).toArray();

  for (let i of projectList) {
    i._id = i._id.toString();
  }

  //Output
  return projectList;
};

//-----------------------------------------getAllEmployerProjects-------------------------------------------------------

async function getAllEmployerProjects(employerID) {
  if (!employerID) throw "Pass a employerID to search";
  if (typeof employerID !== "string") throw "Invalid employer ID";
  if (employerID.trim().length === 0 ) throw "Empty spaces as input";

  const pCollection = await project();

  const foundList = await pCollection.find({ createdBy: employerID }).toArray();
  if (!foundList) "throw could not find projects for the employerID";

  return foundList;
}

//-----------------------------------------getAllFreelancerProjects-------------------------------------------------------

const getAllFreelancerProjects = async (freelancerID) => {
  if (!freelancerID) throw "Pass a freelancerID to search";
  if (typeof freelancerID !== "string") throw "Invalid freeelancer ID";
  if (freelancerID.trim().length === 0 ) throw "Empty spaces as input";

  const pCollection = await project();

  const foundList = await pCollection
    .find({ assignedTo: freelancerID })
    .toArray();
  if (!foundList) "throw could not find projects for the freelancerID";

  return foundList;
};

//-----------------------------------------updateProject-------------------------------------------------------

const updateProject = async (data) => {
  const {
    id,
    name,
    description,
    tenureMonths,
    skillsRequired,
    hourlyPay,
    hrsPerDay,
    daysPerWeek,
  } = data;

  if (
    !id ||
    !name ||
    !description ||
    !tenureMonths ||
    !skillsRequired ||
    !hourlyPay ||
    !hrsPerDay ||
    !daysPerWeek
  )
    throw "missing fields";

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof tenureMonths !== "number" ||
    (typeof skillsRequired !== "object" && !skillsRequired.length) ||
    typeof hourlyPay !== "number" ||
    typeof hrsPerDay !== "number" ||
    typeof daysPerWeek !== "number"
  )
    throw "Invalid fields";

  if (
    id.trim().length === 0 ||
    name.trim().length === 0 ||
    description.trim().length === 0 
  ) {
    throw "Empty spaces as input";
  }

  if (hrsPerDay < 0 || hrsPerDay > 8)
    throw "Hours per day should be less than 8 and greater than zero";
  if (daysPerWeek < 0 || daysPerWeek > 6)
    throw "Days per week should be greater than zero and less than 6";

  const projectExist = await getProject(id);
  if (!projectExist) throw "No project exist for the given ID";

  let skillsArray = await getSkill(skillsRequired);

  const updateReq = {
    name,
    description,
    tenureMonths,
    skillsRequired: skillsArray,
    hourlyPay,
    hrsPerDay,
    daysPerWeek,
  };
  const projectCollection = await project();
  let objectId = ObjectId(id);
  const updateInfo = await projectCollection.updateOne(
    { _id: objectId },
    { $set: updateReq }
  );
  if (updateInfo.modifiedCount === 0) throw "Could not update the project";

  let updatedProject = await getProject(id);
  updatedProject = { _id: updatedProject._id.toString(), ...updatedProject };
  return updatedProject;
};

//----------------------------------------updateProjectStatus----------------------------------------------------------------

const updateProjectStatus = async (projectId, status) => {

  if (!projectId || !status) throw "Please pass all the fields";
  if (typeof projectId !== "string" || typeof status !== "number") throw "invalid type of fields";
  if (projectId.trim().length === 0 ) throw "Empty spaces as input";

  const projectExist = await getProject(projectId);
  if (!projectExist) throw "No project exist for the given ID";

  if (projectExist.status !== 0 && status === 0)
    throw "Cannot change status of accepted project back to created";

  const projectCollection = await project();
  let objectId = ObjectId(projectId);
  const updateInfo = await projectCollection.updateOne(
    { _id: objectId },
    { $set: { status: status } }
  );
  if (updateInfo.modifiedCount === 0) throw "Could not update the project";

  if (status === 3 || status === 4) {
    const getSuccessInfo = await getSuccessRate(projectExist.assignedTo);
    console.log(getSuccessInfo);
    if (!getSuccessInfo) throw "Cannot get successInfo for the freelancer";
    const { successRate, closedProjects, completeProjects, projectBySkills } =
      getSuccessInfo;
    const freelancerCollection = await freelancer();
    const updatedInfo = await freelancerCollection.updateOne(
      { _id: ObjectId(projectExist.assignedTo) },
      {
        $set: {
          successRate,
          closedProjects,
          completeProjects,
          projectBySkills,
        },
      }
    );
    if (updatedInfo.modifiedCount === 0)
      throw "Could not update the freelancer";
  }

  let updatedProject = await getProject(projectId);
  updatedProject = { _id: updatedProject._id.toString(), ...updatedProject };
  return updatedProject;
};

//-----------------------------------------addingRequestToFreelancer---------------------------------------------------------

const addRequest = async (freelancerId, projectId) => {
  if (!freelancerId || !projectId) throw "Please pass both freelancer ID and project ID";
  if (typeof freelancerId !== "string" || typeof projectId !== "string") throw "Invalid type of request";
  if (freelancerId.trim().length === 0 || projectId.trim().length === 0 ) throw "Empty spaces as input";

  let foundProject = await getProject(projectId);
  await getFreelancer(freelancerId);

  let objProjectId = ObjectId(projectId);

  const projectCollection = await project();

  const exist = await projectCollection.findOne({
    _id: objProjectId,
    requested: { $in: [freelancerId] },
  });
  if (exist)
    throw `The freelancer ${
      exist.status === 0 ? "has a request for" : "is working on"
    } this project`;

  const insertedRequest = await projectCollection.updateOne(
    { _id: objProjectId },
    { $push: { requested: freelancerId } }
  );
  if (insertedRequest.modifiedCount === 0) throw "Could not add request";

  foundProject = await getProject(projectId);
  let found = foundProject.requested.find((i) => i === freelancerId);
  if (!found) throw "could not find freelancer id in the requests";

  return { addedRequest: true };
};

//-----------------------------------------getFreelancerRequests---------------------------------------------------------

const getFreelancerRequests = async (freelancerId) => {
  if (!freelancerId) throw "please pass a freelancer ID";
  if (typeof freelancerId !== "string") throw "Invalid freelancer ID";
  if (freelancerId.trim().length === 0 ) throw "Empty spaces as input";

  await getFreelancer(freelancerId);

  const projectCollection = await project();
  const found = await projectCollection
    .find({ requested: { $in: [freelancerId] }, status: { $eq: 0 } })
    .toArray();
  if (!found) throw "No request found for the given freelancer";

  return found;
};

//-----------------------------------------updateFreelancerRequest---------------------------------------------------------

const updateFreelancerRequest = async (projectId, freelancerId, status) => {
  if (!freelancerId || !projectId || !status)
    throw "Please pass both freelancer ID and project ID";

  if (
    typeof freelancerId !== "string" ||
    typeof projectId !== "string" ||
    typeof status !== "string"
  )
    throw "Invalid type of request";

  if (
    freelancerId.trim().length === 0 ||
    projectId.trim().length === 0 ||
    status.trim().length === 0
  ) {
    throw "Empty spaces as input";
  }

  if (
    status.trim().toLowerCase() !== "accept" &&
    status.trim().toLowerCase() !== "reject"
  )
    throw "Invalid status";

  let foundProject = await getProject(projectId);
  if (!foundProject) throw "Could not find the project";

  if (foundProject.assignedTo)
    throw "This project has already been assigned to a freelancer";

  await getFreelancer(freelancerId);

  let objProjectId = ObjectId(projectId);

  const projectCollection = await project();

  let updateInfo;

  if (status.trim().toLowerCase() === "accept") {
    updateInfo = await projectCollection.updateOne(
      { _id: objProjectId },
      {
        $set: {
          assignedTo: freelancerId,
          status: 1,
          assignedOn: getCurrentTime(),
          dueBy: addMonths(new Date(), foundProject.tenureMonths).toString(),
        },
      }
    );
  } else {
    updateInfo = await projectCollection.updateOne(
      { _id: objProjectId },
      { $pull: { requested: freelancerId } }
    );
  }
  if (updateInfo.modifiedCount === 0) throw "could not update the project";

  foundProject = await getProject(projectId);
  return foundProject;
};

//-----------------------------------------deleteProject----------------------------------------------------------------

const deleteProject = async (projectId) => {
  if (!projectId) throw "Please pass an ID";
  if (typeof projectId !== "string") throw "Invalid projectID";
  if (projectId.trim().length === 0 ) throw "Empty spaces as input";

  const found = await getProject(projectId);

  if (found.status !== 0)
    throw "Sorry cannot delete this project as it has been accepted by a freelancer";

  let objID = ObjectId(projectId);

  const projCollection = await project();
  const deleteInfo = await projCollection.deleteOne({ _id: objID });
  if (deleteInfo.deletedCount === 0) throw "could not delete project";

  return { deleted: true };
};

//-----------------------------------------searchProject----------------------------------------------------------------
const filterProject = async (filterObj) => {
  if (!filterObj.query || !filterObj.userType || !filterObj.userId)
    throw "Please provide all the details";
  if (
    typeof filterObj.query !== "string" ||
    typeof filterObj.userType !== "string" ||
    typeof filterObj.userId !== "string"
  )
    throw "Invalid type of input object";
  if (
    filterObj.query.trim().length === 0 ||
    filterObj.userType.trim().length === 0 ||
    filterObj.userId.trim().length === 0
  )
    throw "empty spaces for input object";

  const projectCollection = await project();

  let result = [];
  if (
    filterObj.filterkey === "name" ||
    !filterObj.filterkey ||
    filterObj.filterkey === "null"
  ) {
    let listForName;
    if (filterObj.userType === "freelancer") {
      listForName = await projectCollection
        .find({
          name: { $regex: `${filterObj.query}`, $options: "i" },
          status: { $ne: 0 },
          assignedTo: { $eq: filterObj.userId },
        })
        .toArray();
    } else {
      listForName = await projectCollection
        .find({
          name: { $regex: `${filterObj.query}`, $options: "i" },
          status: { $ne: 0 },
          createdBy: { $eq: filterObj.userId },
        })
        .toArray();
    }
    result = [...result, ...listForName];
  }
  if (
    filterObj.filterkey === "skill" ||
    !filterObj.filterkey ||
    filterObj.filterkey === "null"
  ) {
    let listForSkills;
    if (filterObj.userType === "freelancer") {
      listForSkills = await projectCollection
        .find({
          "skillsRequired.name": {
            $regex: `${filterObj.query}`,
            $options: "i",
          },
          status: { $ne: 0 },
          assignedTo: { $eq: filterObj.userId },
        })
        .toArray();
    } else {
      listForSkills = await projectCollection
        .find({
          "skillsRequired.name": {
            $regex: `${filterObj.query}`,
            $options: "i",
          },
          status: { $ne: 0 },
          createdBy: { $eq: filterObj.userId },
        })
        .toArray();
    }
    result = [...result, ...listForSkills];
  }
  let finalResult = [];
  result.forEach((el) => {
    if (finalResult.length > 0) {
      const exist = finalResult.find(
        (i) => i._id.toString() === el._id.toString()
      );
      if (!exist) {
        finalResult.push({
          _id: el._id.toString(),
          ...el,
        });
      }
    } else {
      finalResult.push({
        _id: el._id.toString(),
        ...el,
      });
    }
  });

  return finalResult;
};

module.exports = {
  createProject,
  getProject,
  getAll,
  updateProject,
  getAllEmployerProjects,
  getAllFreelancerProjects,
  addRequest,
  getFreelancerRequests,
  updateFreelancerRequest,
  deleteProject,
  updateProjectStatus,
  filterProject,
};
