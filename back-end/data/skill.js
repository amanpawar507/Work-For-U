const {skill} = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");


const getCurrentTime = () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

const createSkill = async name => {
    if(!name) throw "provide a name for the skill";
    if(typeof name !== "string") throw "invalid type of input";

    const skillCollection = await skill();

    const newEntry = {
                        name,
                        createdAt: getCurrentTime()
                    }
    const addedEntry = await skillCollection.insertOne(newEntry);
    if(addedEntry.insertedCount === 0) throw "could not add the skill";
    
    addedEntryInfo = await skillCollection.findOne({_id: addedEntry.insertedId});
    if(!addedEntry) throw "could not find the added skill";

    return true
 }

 const getSkill = async idArray => {
     if(!idArray) throw "provide an ID to search";
     if(typeof idArray !== 'object' && !idArray.length) throw "Invalid Id array";

     const skillCollection = await skill();
     let objIds = [];
     idArray.forEach(element => {
         objIds.push(ObjectId(element));
     });
     console.log(objIds);
     const found = await skillCollection.find({_id: {$in: objIds}}).toArray();
     console.log(found);
     if(!found) throw "could not find the skill for the given ID";

     return found;
 }

 module.exports = {
     createSkill,
     getSkill
 }