const { freelancer } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
const { getProject } = require("./project");
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

  if (filterObj.filterkey == "name") {
    for (let i of freelancerList) {
      if (i.name.includes(filterObj.query)) {
        resultarr.push(i);
      }
    }
  } else if (filterObj.filterkey == "skill") {
    for (let i of freelancerList) {
      for(let j of i.skills){
        if (j.includes(filterObj.query)) {
          resultarr.push(i);
        }
      }
    }
  } else throw "Unidentified object value";

  return resultarr;
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

  const employerCollection = await employer();
  let user = await employerCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  if (!user || !user._id) throw "Either the emailId or password is invalid";
  let mat = await bcrypt.compare(password, user.password);
  if (!mat) throw "Either the emailId or password is invalid";
  return { authenticated: true };
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
//---------------------------------------------rating and review-----------------------------------------------

module.exports = {
  createFreelancer,
  getAll,
  getFreelancer,
  searchType,
  checker,
  remove,
};
