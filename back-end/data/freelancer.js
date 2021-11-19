const { freelancer } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
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

const createFreelancer = async ({
  fullName,
  emailId,
  password,
  introduction,
  skills,
  projects,
  overallRating,
  reviews,
  location,
  successRate,
  expectedPay,
  createdAt,
}) => {
  if (
    !fullName ||
    !emailId ||
    !password ||
    !introduction ||
    !skills ||
    !projects ||
    !overallRating ||
    !reviews ||
    !location ||
    !successRate ||
    !expectedPay ||
    !createdAt
  )
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof introduction !== "string" ||
    (typeof skills !== "object" && !skills.length) ||
    (Array.isArray(skills) && !skills.length) ||
    (Array.isArray(projects) && !projects.length) ||
    typeof overallRating !== "number" ||
    (Array.isArray(reviews) && !reviews.length) ||
    typeof location !== "string" ||
    typeof successRate !== "number" ||
    typeof expectedPay !== "number"
  )
    throw "Invalid type of data";

  //let skillsArrayF = await getSkill(skills);
  const freelancerCollection = await freelancer();

  const newEntry = {
    fullName,
    emailId,
    password,
    introduction,
    skills,
    projects,
    overallRating,
    reviews,
    location,
    successRate,
    expectedPay,
    createdAt: getCurrentTime(),
  };
  let addedEntryF = await freelancerCollection.insertOne(newEntry);
  if (addedEntryF.insertedCount === 0)
    throw "The freelancer couldn't be created";

  let newEntryInfo = await freelancerCollection.findOne({
    _id: addedEntryF.insertedId,
  });
  if (!newEntryInfo) throw "Could not find the freelancer";

  return {
    _id: newEntryInfo._id.toString(),
    ...newEntryInfo,
  };
};

module.exports = {
  createFreelancer,
};
