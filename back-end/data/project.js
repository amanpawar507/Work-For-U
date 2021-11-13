const {project} = require('../config/mongoCollections');
const {getSkill}  = require('./skill');
const {ObjectId} = require("mongodb");


const getCurrentTime = () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

const createProject = async (name, description, tenureMonths, skillsRequired, hourlyPay, status, createdBy) => {
    if(!name || !description || !tenureMonths || !skillsRequired || !hourlyPay || !status || !createdBy) throw "Missing fields";
    if(
        typeof name !== "string" || 
        typeof description !== "string" || 
        typeof tenureMonths !== "number" || 
        (typeof skillsRequired !== "object" && !skillsRequired.length) || 
        typeof hourlyPay !== "number" || 
        typeof status !== "number" || 
        typeof createdBy !== "string" 
    ) throw "Invalid type of data";


    let skillsArray = await getSkill(skillsRequired);


    const projectCollection = await project();
    
    const newEntry = {
        name,
        description,
        tenureMonths,
        skillsRequired: skillsArray,
        hourlyPay,
        status,
        createdBy,
        assignedTo: null,
        createdAt: getCurrentTime()
    }

    let addedEntry = await projectCollection.insertOne(newEntry);
    if(addedEntry.insertedCount === 0) throw "The project couldn't be created";

    let newEntryInfo = await projectCollection.findOne({_id: addedEntry.insertedId});
    if(!newEntryInfo) throw "Could not find the created project";

    return {
        _id: newEntryInfo._id.toString(),
        ...newEntryInfo
    }

}

module.exports = {
    createProject
}