const dbConnection = require("../config/mongoConnection");
const {freelancer } = require("../data");

async function main() {
    const db = await dbConnection();
  //   await db.dropDatabase();
  
  
    try {
       await freelancer.createIndices();
  
    } catch (error) {
      console.log(error);
      return;
    }
  
    console.log("Done seeding database");
  
    await db.s.client.close();
  }
  
  try {
    main();
  } catch (error) {
    console.log(error);
  }
  