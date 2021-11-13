const dbConnection = require('../config/mongoConnection');
const {skill} = require('../data');


async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    const skills = ["ReactJS", "MongoDB", "Marketing Strategy", "System Management", "SQL", "Html"]

    try {
        let result = await skill.createSkill("ReactJS");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }
    
    try {
        let result = await skill.createSkill("MongoDB");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        let result = await skill.createSkill("Marketing Strategy");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        let result = await skill.createSkill("System Management");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        let result = await skill.createSkill("SQL");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        let result = await skill.createSkill("Html");
        if(!result) {
            console.log('could not create')
            throw "some error";
        }
    } catch (error) {
        console.log(error);
        return;
    }

    console.log('Done seeding database');

    await db.s.client.close();
} 

try {
    main();
} catch (error) {
    console.log(error);
}
