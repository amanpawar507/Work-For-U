const { employer } = require("../config/mongoCollections");
const { getProject } = require("./project");
//const { getSkill } = require("./freelanceFunctions");
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

const createEmployer = async ({
  fullName,
  emailId,
  password,
  companyName,
  projects,
  createdAt,
}) => {
  if (
    !fullName ||
    !emailId ||
    !password ||
    !companyName ||
    !projects ||
    !createdAt
  )
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof companyName !== "string" ||
    (Array.isArray(projects) && !projects.length)
  )
    throw "Invalid type of data";

  //let = await getSkill(skillsRequired);
  let projectArrayE = await getProject(projects);
  const employerCollection = await employer();
  const newEntry = {
    fullName,
    emailId,
    password,
    projects: projectArrayE,
    companyName,
    createdAt: getCurrentTime(),
  };
  let addedEntryE = await employerCollection.insertOne(newEntry);
  if (addedEntryE.insertedCount === 0) throw "The employer couldn't be created";

  let newEntryInfo = await employerCollection.findOne({
    _id: addedEntryE.insertedId,
  });
  if (!newEntryInfo) throw "Could not find the employer";

  return {
    _id: newEntryInfo._id.toString(),
    ...newEntryInfo,
  };
};

module.exports = {
  createEmployer,
};
