const { freelancer, project } = require("../config/mongoCollections");
const { getSkill } = require("./skill");
const { getEmployer } = require("./employer");
//const {getAllEmployerProjects} = require("./project");
//const { getSkill } = require("./freelanceFunctions");
const { ObjectId } = require("mongodb");
const bCrypt = require("bcrypt");
const e = require("express");
const saltRounds = 16;

async function getAllEmployerProjects(employerID) {
  if (!employerID) throw "Pass a employerID to search";
  if (typeof employerID !== "string") throw "Invalid employer ID";

  const pCollection = await project();

  const foundList = await pCollection.find({ createdBy: employerID }).toArray();
  if (!foundList) "throw could not find projects for the employerID";

  return foundList;
}

const getAllFreelancerProjects = async (freelancerID) => {
  if (!freelancerID) throw "Pass a freelancerID to search";
  if (typeof freelancerID !== "string") throw "Invalid freeelancer ID";

  const pCollection = await project();

  const foundList = await pCollection
    .find({ assignedTo: freelancerID })
    .toArray();
  if (!foundList) throw "could not find projects for the freelancerID";

  return foundList;
};

const getCurrentTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

const createIndices = async () => {
  const freelancerCollection = await freelancer();
  const result = await freelancerCollection.createIndex({
    fullName: "text",
    skills: "text",
    location: "text",
  });
  console.log(result);
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
    !introduction||
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

  if (
    fullName.trim().length === 0 ||
    emailId.trim().length === 0 ||
    password.trim().length === 0 ||
    location.trim().length === 0
  ) {
    throw "Empty spaces as input";
  }

  if (password.trim().length < 6)
    throw "Password should be atleast 6 characters!";

  if (expectedPay < 0) throw "Expected pay should be atleast greater than 0!";

  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(emailId)) throw "Email ID not valid";

  const freelancerrCollection = await freelancer();
  const emailExists = await freelancerrCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  // if (!emailExists) {
  const emailLower = emailId.toLowerCase();
  // }
  // const newEntry = {
  //   username: usernameLower,
  //   password: storeHash,
  // };

  let skillsArrayF = await getSkill(skills);
  //console.log(skillsArrayF);
  const hash = await bCrypt.hash(password, saltRounds);
  const freelancerCollection = await freelancer();

  const newEntry = {
    fullName,
    emailId: emailId.toLowerCase(),
    password: hash,
    introduction,
    skills: skillsArrayF,
    overallRating: 0,
    reviews: [],
    location,
    successRate: 0,
    closedProjects: 0,
    completeProjects: 0,
    projectBySkills: {},
    expectedPay,
    createdAt: getCurrentTime(),
  };

  let duplicateUser = await freelancerCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  console.log("dublicate user: ", duplicateUser);
  if (duplicateUser) throw "There is already a user with that username";

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
  if (!filterObj.query) throw "Please provide all the details";
  if (typeof filterObj.query !== "string") throw "Invalid type of input object";
  if (filterObj.query.trim().length === 0)
    throw "empty spaces for input object";

  const freelancerCollection = await freelancer();

  let result = [];

  if (
    filterObj.filterkey === "name" ||
    !filterObj.filterkey ||
    filterObj.filterkey === "null"
  ) {
    const listForName = await freelancerCollection
      .find({ fullName: { $regex: `${filterObj.query}`, $options: "i" } })
      .toArray();
    result = [...result, ...listForName];
  }
  if (
    filterObj.filterkey === "location" ||
    !filterObj.filterkey ||
    filterObj.filterkey === "null"
  ) {
    const listForLocation = await freelancerCollection
      .find({ location: { $regex: `${filterObj.query}`, $options: "i" } })
      .toArray();
    result = [...result, ...listForLocation];
  }
  if (
    filterObj.filterkey === "skill" ||
    !filterObj.filterkey ||
    filterObj.filterkey === "null"
  ) {
    const listForSkills = await freelancerCollection
      .find({ "skills.name": { $regex: `${filterObj.query}`, $options: "i" } })
      .toArray();
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
  return { _id: user._id.toString(), ...user };
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

const getRecommended = async (employerId) => {
  if (!employerId) throw "Please pass an employer ID";
  if (typeof employerId !== "string") throw "Invalid type of employerID";
  if (employerId.trim().length === 0) throw "empty spaces found";
  ObjectId(employerId);
  //const employerFound = await getEmployer(employerId);
  // if(employerFound) {
  const allProjects = await getAllEmployerProjects(employerId);
  let skillsRequired = [];
  allProjects.map((i) => {
    skillsRequired = [...skillsRequired, ...i.skillsRequired];
  });
  skillsRequired = skillsRequired.map((i) => i._id);
  skillsRequired = Array.from(new Set(skillsRequired));
  const freelancerCollection = await freelancer();
  let matchedFreelancers = await freelancerCollection
    .find({ "skills._id": { $in: skillsRequired } })
    .toArray();
  if (!matchedFreelancers) throw "could not find recommendations";
  for (let i of matchedFreelancers) {
    i._id = i._id.toString();
  }
  return matchedFreelancers;
  // }else{
  //   throw "could not find employer"
  // }
};

//---------------------------------------------Blacklisting-----------------------------------------------

const Blacklist = async (freelancerID, employerID) => {
  let verifyfreelancer = await getFreelancer(freelancerID);
  let verifyemployer = await getEmployer(employerID);
  const freelancerCollection = await freelancer();

  let parsedId = ObjectId(freelancerID);
  let freelanceraction = await freelancerCollection.findOne({ _id: parsedId });

  if ("blacklist" in freelanceraction) {
    for (let i of freelanceraction.blacklist) {
      if (i == employerID) {
        throw "Employer already added to blacklist sequence";
      }
    }
  }
  const updatedInfo = await freelancerCollection.updateOne(
    { _id: parsedId },
    { $push: { blacklist: employerID } }
  );
  let updatedfreelancer = await getFreelancer(freelancerID);
  return updatedfreelancer;
};

//---------------------------------------BlacklistDelete------------------------------------------------

const Blacklistremove = async (freelancerID, employerID) => {
  let verifyfreelancer = await getFreelancer(freelancerID);
  let verifyemployer = await getEmployer(employerID);
  const freelancerCollection = await freelancer();

  let parsedId = ObjectId(freelancerID);
  let freelanceraction = await freelancerCollection.findOne({ _id: parsedId });
  // let count = -1;

  if ("blacklist" in freelanceraction) {
    if (freelanceraction.blacklist.length === 0) {
      throw "You have not blacklisted anyone yet";
    }
    let removedblackist = await freelancerCollection.updateOne(
      { _id: parsedId },
      { $pull: { blacklist: employerID } }
    );
    if (removedblackist.modifiedCount === 1) {
      let updatedfreelancer = await getFreelancer(freelancerID);
      return updatedfreelancer;
    } else {
      throw "Could not delete the employer from blacklist";
    }
  } else throw "You have not blacklisted anyone yet";
};

//---------------------------------------SuccessRate------------------------------------------------

const getSuccessRate = async (freelancerId) => {
  if (!freelancerId) throw "Pass a freelancer ID";
  if (typeof freelancerId !== "string") throw "Invalid type of ID";
  ObjectId(freelancerId);

  const allProjects = await getAllFreelancerProjects(freelancerId);
  let closedProjects = 0;
  let completeProjects = 0;
  let projectBySkills = {};
  allProjects.forEach((proj) => {
    if (proj.status === 3 || proj.status === 4) {
      closedProjects += 1;
      if (proj.status === 3) {
        completeProjects += 1;
        proj.skillsRequired.forEach((skill) => {
          if (projectBySkills[skill.name]) {
            projectBySkills[skill.name] += 1;
          } else {
            projectBySkills[skill.name] = 1;
          }
        });
      }
    }
  });
  const successRate = (completeProjects / closedProjects) * 100;
  return {
    closedProjects,
    completeProjects,
    projectBySkills,
    successRate,
  };
};
//--------------------------------------EditProfile--------------------------------------------------

const editProfile = async (data) => {
  const { id, fullName, introduction, skills, location, expectedPay } = data;
  if (
    !id ||
    !fullName ||
    !skills ||
    !introduction ||
    !location ||
    !expectedPay
  ) {
    throw "Missing Fields";
  }

  if (
    typeof id !== "string" ||
    typeof fullName !== "string" ||
    typeof introduction !== "string" ||
    (typeof skills !== "object" && !skills.length) ||
    typeof location !== "string" ||
    typeof expectedPay !== "number"
  ) {
    throw "Invalid type of data";
  }

  let skillsArrayF = await getSkill(skills);

  const newEntry = {
    fullName: fullName,
    introduction: introduction,
    skills: skillsArrayF,
    location: location,
    expectedPay: expectedPay,
    updatedAt: getCurrentTime(),
  };

  const freelancerCollection = await freelancer();

  let findID = await freelancerCollection.findOne({
    _id: ObjectId(id.trim()),
  });
  if (findID === null) {
    throw "Freelancer does not exist for the given id ${employerID.trim()}";
  } else {
    const updatedInfo = await freelancerCollection.updateOne(
      { _id: ObjectId(id.trim()) },
      { $set: newEntry }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update employer successfully";
    }
    const updatedprofile = await getFreelancer(id);
    return updatedprofile;
  }
};

module.exports = {
  createFreelancer,
  getAll,
  getFreelancer,
  searchType,
  checker,
  remove,
  createIndices,
  getRecommended,
  Blacklist,
  Blacklistremove,
  getSuccessRate,
  editProfile,
};
