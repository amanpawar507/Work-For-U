const { freelancer } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
const {getEmployer} = require('./employer');
const { getProject,getAllEmployerProjects } = require("./project");
//const { getSkill } = require("./freelanceFunctions");
const { ObjectId } = require("mongodb");
const bCrypt = require("bcrypt");
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

const createIndices = async() => {
  const freelancerCollection = await freelancer();
  const result = await freelancerCollection.createIndex({
    fullName: "text",
    skills: "text",
    location: "text"
  });
  console.log(result);
}

const createFreelancer = async (data) => {
  const {
    fullName,
    emailId,
    password,
    introduction,
    skills,
    location,
    expectedPay,
  } = data;

  if (
    !fullName ||
    !emailId ||
    !password ||
    !introduction ||
    !skills ||
    !location ||
    !expectedPay
  )
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof introduction !== "string" ||
    (Array.isArray(skills) && !skills.length) ||
    typeof location !== "string" ||
    typeof expectedPay !== "number"
  )
    throw "Invalid type of data";

  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(emailId)) throw "Email ID not valid";

  let skillsArrayF = await getSkill(skills);
  //console.log(skillsArrayF);
  const hash = await bCrypt.hash(password, saltRounds);
  const freelancerCollection = await freelancer();

  const newEntry = {
    fullName,
    emailId,
    password: hash,
    introduction,
    skills: skillsArrayF,
    overallRating: 0,
    reviews: [],
    location,
    successRate: 0,
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

//-----------------------------------------getAll---------------------------------------------------------

const getAll = async () => {
  //Exceptions

  const freelancerCollection = await freelancer();
  const freelancerList = await freelancerCollection.find({}).toArray();

  for (let i of freelancerList) {
    i._id = i._id.toString();
  }

  //Output
  return freelancerList;
};

//-----------------------------------------get---------------------------------------------------------
const getFreelancer = async (freelancerID) => {
  if (!freelancerID) throw "You must provide an ID to search for";
  if (typeof freelancerID !== "string")
    throw "You must provide an ID in string only";
  if (!ObjectId.isValid(freelancerID.trim()))
    throw "Please provide a valid objectID.";

  const freelancerCollection = await freelancer();

  let findID = await freelancerCollection.findOne({
    _id: ObjectId(freelancerID.trim()),
  });
  if (findID === null)
    throw `Freelancer does not exist for the given id ${freelancerID.trim()}`;
  findID._id = findID._id.toString();
  console.log(findID);
  return findID;
};

//-----------------------------------------getonbasisofSkillAndName---------------------------------------------------------

const searchType = async (filterObj) => {
  if (!filterObj.query || !filterObj.filterkey)
    throw "Please provide all the details";
  if (
    typeof filterObj.query !== "string" ||
    typeof filterObj.filterkey !== "string"
  )
    throw "Invalid type of input object";
  if (
    filterObj.query.trim().length === 0 ||
    filterObj.filterkey.trim().length === 0
  )
    throw "empty spaces for input object";

  const freelancerCollection = await freelancer();
  const freelancerList = await freelancerCollection.find({}).toArray();
  let resultarr = [];

  if (filterObj.filterkey === "name") {
    for (let i of freelancerList) {
      if(i.fullName.length > filterObj.query.length) {
        if (i.fullName.toLowerCase().includes(filterObj.query.toLowerCase())) {
          resultarr.push(i);
        }
      }else{
        if (filterObj.query.toLowerCase().includes(i.fullName.toLowerCase())) {
          resultarr.push(i);
        }
      }
    }
    return resultarr;
  } else if (filterObj.filterkey === "skill") {
    for (let i of freelancerList) {
      for(let j of i.skills){
        if (j.name.toLowerCase().includes(filterObj.query.toLowerCase())) {
          resultarr.push(i);
        }
      }
    }
    return resultarr;
  } else throw "Unidentified object value";

  
};
/////-----------------------------------------checkFreelancer-----------------------------------------------------
async function checker(emailId, password) {
  if (!emailId || !password) throw "All fields to have valid values";
  if (typeof emailId !== "string" || typeof password !== "string")
    throw "All the parameters has to be string";
  if (emailId.trim().length == 0 || password.trim().length == 0)
    throw "All the parameters has to be string";
  if (!emailId.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
    throw "Incorrect username or password";
  if (password.length < 6) throw "Incorrect username or password";

  const freelancerCollection = await freelancer();
  let user = await freelancerCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  if (!user || !user._id) throw "Either the emailId or password is invalid";
  let mat = await bCrypt.compare(password, user.password);
  if (!mat) throw "Either the emailId or password is invalid";
  return { _id:user._id.toString(),...user};
}
//--------------------------------------------delete freelancer-----------------------------------------------
const remove = async (freelancerID) => {
  const rest = await freelancer();

  const deletionInfo = await rest.deleteOne({ _id: ObjectId(freelancerID) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete freelancer with id of ${id}`;
  }
  return { Deleted: true };
};
//---------------------------------------------get recommended freelancers-----------------------------------------------

const getRecommended = async employerId => {
  if(!employerId) throw "Please pass an employer ID";
  if(typeof employerId !== "string") throw "Invalid type of employerID";
  if(employerId.trim().length === 0) throw "empty spaces found";
  ObjectId(employerId);
  const employerFound = await getEmployer(employerId);
  const allProjects = await getAllEmployerProjects(employerId);
  let skillsRequired = [];
  allProjects.map(i => {
    skillsRequired = [...skillsRequired,...i.skillsRequired]
  });
  skillsRequired = skillsRequired.map(i=>i._id);
  skillsRequired = Array.from(new Set(skillsRequired));
  const freelancerCollection = await freelancer();
  let matchedFreelancers = await freelancerCollection.find({'skills._id': {$in: skillsRequired}}).toArray();
  if(!matchedFreelancers) throw "could not find recommendations";
  for (let i of matchedFreelancers) {
    i._id = i._id.toString();
  }
  return matchedFreelancers;
}



module.exports = {
  createFreelancer,
  getAll,
  getFreelancer,
  searchType,
  checker,
  remove,
  createIndices,
  getRecommended
};
