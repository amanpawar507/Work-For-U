const { project } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
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

const createProject = async (data) => {
  const {
    name,
    description,
    tenureMonths,
    skillsRequired,
    hourlyPay,
    status,
    createdBy,
  } = data;
  if (
    !name ||
    !description ||
    !tenureMonths ||
    !skillsRequired ||
    !hourlyPay ||
    !status ||
    !createdBy
  )
    throw "Missing fields";
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof tenureMonths !== "number" ||
    (typeof skillsRequired !== "object" && !skillsRequired.length) ||
    typeof hourlyPay !== "number" ||
    typeof status !== "number" ||
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
    hourlyPay,
    status,
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
  if (arguments.length != 0) throw `No parameter required`;

  const projectCollection = await project();
  const projectList = await projectCollection.find({}).toArray();

  for (let i of projectList) {
    i._id = i._id.toString();
  }

  //Output
  return projectList;
};

module.exports = {
  createProject,
  getProject,
};
