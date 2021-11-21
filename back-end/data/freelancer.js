const { freelancer } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
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

const createFreelancer = async data => {

  const {
    fullName,
    emailId,
    password,
    introduction,
    skills,
    overallRating,
    reviews,
    location,
    successRate,
    expectedPay,
  } = data;

  if (
    !fullName ||
    !emailId ||
    !password ||
    !introduction ||
    !skills ||
    !overallRating ||
    !reviews ||
    !location ||
    !successRate ||
    !expectedPay
  )
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof introduction !== "string" ||
    (Array.isArray(skills) && !skills.length) ||
    typeof overallRating !== "number" ||
    (Array.isArray(reviews) && !reviews.length) ||
    typeof location !== "string" ||
    typeof successRate !== "number" ||
    typeof expectedPay !== "number"
  )
    throw "Invalid type of data";

  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(emailId)) throw "Email ID not valid";

  let skillsArrayF = await getSkill(skills);
  //console.log(skillsArrayF);
  const freelancerCollection = await freelancer();

  const newEntry = {
    fullName,
    emailId,
    password,
    introduction,
    skills: skillsArrayF,
    projects: [],
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

//-----------------------------------------getAll---------------------------------------------------------

const getAll = async () => {

    
  //Exceptions

  const freelancerCollection = await freelancer();
  const freelancerList = await freelancerCollection.find({}).toArray();

  for(let i of freelancerList){
      i._id = i._id.toString();
   }

  //Output
  return freelancerList;
}


//-----------------------------------------get---------------------------------------------------------

const getFreelancer = async feelancerId => {
  if(!feelancerId) throw "provide a project ID to fetch";
  if(typeof feelancerId !== "string") throw "Invalid project ID";

  const objId = ObjectId(feelancerId);

  const freelancerCollection = await freelancer();
  let foundEntry = await freelancerCollection.findOne({_id: objId});
  if(!foundEntry) throw "could not find project for the given ID";

  return {
      _id: foundEntry._id.toString(),
      ...foundEntry
  }
}

//-----------------------------------------getonbasisofSkillLocation---------------------------------------------------------

const searchType = async filterObj =>{

  if(!filterObj.query || !filterObj.filterkey) throw "Please provide all the details"
  if(typeof(filterObj.query) !== "string" || typeof(filterObj.filterkey) !== "string") throw "Invalid type of input object"
  if((filterObj.query).trim().length === 0 || (filterObj.filterkey).trim().length === 0) throw "empty spaces for input object"
  
  const freelancerCollection = await freelancer();
  const freelancerList = await freelancerCollection.find({}).toArray();
  let resultarr = [];

  if(filterObj.filterkey == 'name'){
  
    for(let i of freelancerList){
      if((i.name).includes(filterObj.query)){
        resultarr.push(i);
      }
    }
  }
  else if(filterObj.filterkey == 'skill'){
    for(let i of freelancerList){
      if((i.skill).includes(filterObj.query)){
        resultarr.push(i);
      }
    }
  }
  else throw "Unidentified object value";

  return resultarr;
}
module.exports = {
  createFreelancer,
  getAll,
  getFreelancer,
  searchType
};
