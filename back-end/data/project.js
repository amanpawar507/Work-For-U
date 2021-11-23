const { project } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
const { getFreelancer } = require('./freelancer');
const { ObjectId } = require("mongodb");

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

  const objId = ObjectId(projectId);

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
  } = data;
  if (
    !name ||
    !description ||
    !tenureMonths ||
    !skillsRequired ||
    !hourlyPay ||
    !createdBy
  )
    throw "Missing fields";
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof tenureMonths !== "number" ||
    (typeof skillsRequired !== "object" && !skillsRequired.length) ||
    typeof hourlyPay !== "number" ||
    typeof createdBy !== "string"
  )
    throw "Invalid type of data";

  let skillsArray = await getSkill(skillsRequired);

  const projectCollection = await project();

  const newEntry = {
    name,
    description,
    tenureMonths,
    skillsRequired: skillsArray,
    requested:[],
    hourlyPay,
    status: 0,
    createdBy,
    assignedTo: null,
    createdAt: getCurrentTime(),
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

const getAllEmployerProjects = async employerID => {
  if(!employerID) throw "Pass a employerID to search";
  if(typeof employerID !== 'string') throw "Invalid employer ID";
  
  const pCollection = await project();

  const foundList = await pCollection.find({createdBy: employerID}).toArray();
  if(!foundList) "throw could not find projects for the employerID";

  return foundList;
}

const updateProject = async data => {
  const {
    id,
    name,
    description,
    tenureMonths,
    skillsRequired,
    hourlyPay
  } = data;

  if(
    !id ||
    !name ||
    !description ||
    !tenureMonths ||
    !skillsRequired ||
    !hourlyPay 
  ) throw "missing fields";

  if(
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof tenureMonths !== "number" ||
    (typeof skillsRequired !== "object" && !skillsRequired.length ) ||
    typeof hourlyPay !== "number" 
  ) throw "Invalid fields";

  const projectExist = await getProject(id);
  if(!projectExist) throw "No project exist for the given ID"

  let skillsArray = await getSkill(skillsRequired);

  const updateReq = {
    name,
    description,
    tenureMonths,
    skillsRequired: skillsArray,
    hourlyPay
  }
  const projectCollection = await project();
  let objectId = ObjectId(id);
  const updateInfo = await projectCollection.updateOne({_id: objectId},{$set: updateReq});
  if(updateInfo.modifiedCount === 0) throw "Could not update the project";
  
  const updatedProject = await getProject(id);
  return updatedProject;

}

//-----------------------------------------addingRequestToFreelancer---------------------------------------------------------

const addRequest = async (freelancerId, projectId) => {
  if(!freelancerId || !projectId) throw "Please pass both freelancer ID and project ID";
  if(typeof freelancerId !== "string" || typeof projectId !== "string") throw "Invalid type of request";

  let foundProject = await getProject(projectId);
  await getFreelancer(freelancerId);

  let objProjectId = ObjectId(projectId);

  const projectCollection = await project();

  const exist = await projectCollection.findOne({requested :{$in:[freelancerId]}});
  console.log(exist);
  if(exist) throw `The freelancer ${exist.status === 0 ? "has a request for" : "is working on"} this project`;

  const insertedRequest = await projectCollection.updateOne({_id: objProjectId}, {$push: {requested: freelancerId}});
  if(insertedRequest.modifiedCount === 0) throw "Could not add request";

  foundProject = await getProject(projectId);
  let found = foundProject.requested.find(i => i === freelancerId);
  if(!found) throw "could not find freelancer id in the requests";

  return {addedRequest: true};
  
}

//-----------------------------------------getFreelancerRequests---------------------------------------------------------

const getFreelancerRequests = async freelancerId => {
  if(!freelancerId) throw "please pass a freelancer ID";
  if(typeof freelancerId !== "string") throw "Invalid freelancer ID";
  
  await getFreelancer(freelancerId);
  
  const projectCollection = await project();
  const found = await projectCollection.find({"requested": {$in: [freelancerId]}}).toArray();
  if(!found || found.length === 0) throw "No request found for the given freelancer";

  return found;

}


module.exports = {
  createProject,
  getProject,
  getAll,
  updateProject,
  getAllEmployerProjects,
  addRequest,
  getFreelancerRequests
};
