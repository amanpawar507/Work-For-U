const { skill } = require("../config/mongoCollections");
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

const createSkill = async (name) => {
  if (!name) throw "provide a name for the skill";
  if (typeof name !== "string") throw "invalid type of input";
  if (name.trim().length === 0 ) throw "Empty spaces as input";

  const skillCollection = await skill();

  const newEntry = {
    name,
    createdAt: getCurrentTime(),
  };
  const addedEntry = await skillCollection.insertOne(newEntry);
  if (addedEntry.insertedCount === 0) throw "could not add the skill";

  addedEntryInfo = await skillCollection.findOne({
    _id: addedEntry.insertedId,
  });
  if (!addedEntryInfo) throw "could not find the added skill";

  return addedEntryInfo;
};

const getAllSkills = async() => {
  const skillCollection = await skill();
  let found = await skillCollection.find({}).toArray();
  if(!found) throw "could not find aany skill";
  found = found.map(i => {return {_id:i._id.toString(),...i}});
  return found;
}

const getSkill = async (idArray) => {
  if (!idArray) throw "provide an ID to search";
  if (typeof idArray !== "object" && !idArray.length) throw "Invalid Id array";

  const skillCollection = await skill();
  let objIds = [];
  idArray.forEach((element) => {
    objIds.push(ObjectId(element));
  });
  console.log(objIds);
  let found = await skillCollection.find({ _id: { $in: objIds } }).toArray();
  if (!found) throw "could not find the skill for the given ID";

  found = found.map(i => {return {...i,_id: i._id.toString()}});

  return found;
};

module.exports = {
  createSkill,
  getSkill,
  getAllSkills
};
