const { employer } = require("../config/mongoCollections");
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

// const createIndices = async() => {
//   const employerCollection = await employer();
//   const result = await employerCollection.createIndex({
//     fullName: "text",
//     skills: "text",
//     location: "text"
//   });
//   console.log(result);
// }

//--------------------------------------Create Employer--------------------------------------------------

const createEmployer = async (data) => {
  const { fullName, emailId, password, companyName } = data;
  if (!fullName || !emailId || !password || !companyName)
    throw "Missing Fields";

  if (
    typeof fullName !== "string" ||
    typeof emailId !== "string" ||
    typeof password !== "string" ||
    typeof companyName !== "string"
  )
    throw "Invalid type of data";

  if (
    fullName.trim().length === 0 ||
    emailId.trim().length === 0 ||
    password.trim().length === 0 ||
    companyName.trim().length === 0
  ) {
    throw "Empty spaces as input";
  }

  if (password.trim().length < 6)
    throw "Password should be atleast 6 characters!";

  if (!emailId.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
    throw "The username has to be in the mentioned format";

  //let = await getSkill(skillsRequired);
  const hash = await bCrypt.hash(password, saltRounds);
  const employerCollection = await employer();
  const newEntry = {
    fullName,
    emailId: emailId.toLowerCase(),
    password: hash,
    companyName,
    createdAt: getCurrentTime(),
  };

  let duplicateUser = await employerCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  if (duplicateUser !== null)
    throw "There is already a user with that username";

  let addedEntryE = await employerCollection.insertOne(newEntry);
  if (addedEntryE.insertedCount === 0) throw "The employer couldn't be created";

  let newEntryInfo = await employerCollection.findOne({
    _id: addedEntryE.insertedId,
  });
  if (!newEntryInfo) throw "Could not find the employer";

  let stringId = newEntryInfo._id.toString();
  newEntryInfo._id = stringId;
  return newEntryInfo;
};

//--------------------------------------Get Employer--------------------------------------------------

const getEmployer = async (employerID) => {
  if (!employerID) throw "You must provide an ID to search for";
  if (typeof employerID !== "string")
    throw "You must provide an ID in string only";
  if (!ObjectId.isValid(employerID.trim()))
    throw "Please provide a valid objectID.";

  const employerCollection = await employer();

  let findID = await employerCollection.findOne({
    _id: ObjectId(employerID.trim()),
  });
  if (findID === null)
    throw "Employer does not exist for the given id ${employerID.trim()}";
  findID._id = findID._id.toString();

  return findID;
};

//--------------------------------------VerifyUser--------------------------------------------------

async function checker(emailId, password) {
  if (!emailId || !password) throw "All fields to have valid values";
  if (typeof emailId !== "string" || typeof password !== "string")
    throw "All the parameters has to be string";
  if (emailId.trim().length == 0 || password.trim().length == 0)
    throw "All the parameters has to be string";
  if (!emailId.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
    throw "Incorrect username or password";
  //if (password.length < 6) throw "Incorrect username or password";

  const employerCollection = await employer();
  let user = await employerCollection.findOne({
    emailId: emailId.toLowerCase(),
  });
  //  if (user !==null) throw "There is already a username with the emailID"

  if (!user || !user._id) throw "Either the emailId or password is invalid";
  let mat = await bCrypt.compare(password, user.password);
  if (!mat) throw "Either the emailId or password is invalid";
  return { _id: user._id.toString(), ...user };
}

//------------------------------------------delete employer------------------------------------------
const remove = async (employerID) => {
  const rest = await employer();

  const deletionInfo = await rest.deleteOne({ _id: ObjectId(employerID) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete employer with id of ${id}`;
  }
  return { Deleted: true };
};

//------------------------------------------GetListEmployer------------------------------------------

const listemployer = async (employeridarr) => {
  const employerCollection = await employer();
  // const result =[];
  const idArr = employeridarr.map((i) => ObjectId(i));
  let result = await employerCollection.find({ _id: { $in: idArr } }).toArray();

  result = result.map((i) => {
    return { _id: i._id.toString(), ...i };
  });
  if (result.length === 0) {
    throw "No employers found for the given Ids";
  } else {
    return result;
  }
};

//--------------------------------------EditProfile--------------------------------------------------

const editProfile = async (data) => {
  const { id, fullName, companyName } = data;
  if (!id || !fullName || !companyName) {
    throw "Missing Fields";
  }
  if (
    typeof id !== "string" ||
    typeof fullName !== "string" ||
    typeof companyName !== "string"
  ) {
    throw "Invalid Type of Data";
  }

  const newEntry = {
    fullName: fullName,
    companyName: companyName,
    updatedAt: getCurrentTime(),
  };

  const employerCollection = await employer();

  let findID = await employerCollection.findOne({
    _id: ObjectId(id.trim()),
  });
  if (findID === null) {
    throw "Employer does not exist for the given id ${employerID.trim()}";
  } else {
    const updatedInfo = await employerCollection.updateOne(
      { _id: ObjectId(id.trim()) },
      { $set: newEntry }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update employer successfully";
    }
    const updatedprofile = await getEmployer(id);
    return updatedprofile;
  }
};

module.exports = {
  createEmployer,
  getEmployer,
  checker,
  remove,
  listemployer,
  editProfile,
};
