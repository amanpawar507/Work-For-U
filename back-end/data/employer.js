const { employer } = require("../config/mongoCollections");
const { getProject } = require("./project");
//const { getSkill } = require("./freelanceFunctions");
const { ObjectId } = require("mongodb");
const bCrypt = require('bcrypt');
const saltRounds = 16;

const getCurrentTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

const createEmployer = async data => {
  const {
    fullName,
    emailId,
    password,
    companyName
  } = data;
  if (
    !fullName ||
    !emailId ||
    !password ||
    !companyName
  )
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof companyName !== "string" 
  )
    throw "Invalid type of data";

  //let = await getSkill(skillsRequired);
  const hash = await bCrypt.hash(password, saltRounds);
  const employerCollection = await employer();
  const newEntry = {
    fullName,
    emailId:emailId.toLowerCase(),
    password:hash,
    companyName,
    createdAt: getCurrentTime(),
  };
  let addedEntryE = await employerCollection.insertOne(newEntry);
  if (addedEntryE.insertedCount === 0) throw "The employer couldn't be created";

  let newEntryInfo = await employerCollection.findOne({
    _id: addedEntryE.insertedId,
  });
  if (!newEntryInfo) throw "Could not find the employer";

  let stringId = newEntryInfo._id.toString();
  newEntryInfo._id = stringId
  return newEntryInfo;
};

const getEmployer = async employerID => {
    
  if(!employerID) throw "You must provide an ID to search for";
  if(typeof(employerID) !== "string") throw "You must provide an ID in string only"
  if (!ObjectId.isValid(employerID.trim())) throw "Please provide a valid objectID."

  const employerCollection = await employer();
  
  let findID = await employerCollection.findOne({_id : ObjectId(employerID.trim()) });
  if(findID === null) throw "Employer does not exist for the given id ${employerID.trim()}";
  findID._id = findID._id.toString();
  
  return findID;
}

module.exports = {
  createEmployer,
  getEmployer
};
