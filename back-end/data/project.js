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
//------------------------------------------get------------------------------------------------------

const get = async (id) => {

    //Exceptions
    if(arguments.length!=1) throw `The required number of parameter are not provided`;
    if (!id) throw `Please provide an id to search`;
    if (typeof(id) !== 'string') throw `Id must be a string`;
    if(id.trim().length==0) throw `Id cannot be an empty string`;
    if(!ObjectId.isValid(id)) throw `Please enter a valid Id`;

    let parsedId = ObjectId(id);

    //Project Collection
    const projectCollection = await project();
    let project = await projectCollection.findOne({ _id: parsedId });
    

    if (project === null) throw `No project with the id: ${id}`;
    else{

        //Output
        project._id = project._id.toString();
        return project;
    }
}

//-----------------------------------------getAll-------------------------------------------------------

const getAll = async () => {

    
    //Exceptions
    if(arguments.length!=0) throw `No parameter required`;

    const projectCollection = await project();
    const projectList = await projectCollection.find({}).toArray();

    for(let i of projectList){
        i._id = i._id.toString();
     }

    //Output
    return projectList;
}

module.exports = {
    createProject
}