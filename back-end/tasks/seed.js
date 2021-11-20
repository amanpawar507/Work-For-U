const dbConnection = require("../config/mongoConnection");
const { skill } = require("../data");
const { project } = require("../data");

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const skills = [
    "ReactJS",
    "MongoDB",
    "Marketing Strategy",
    "System Management",
    "SQL",
    "Html",
  ];
  const projects = [
    {
      name: "WorkForU",
      description: "This is a B2B website for employers to hire freelancers",
      tenureMonths: 3,
      skillsRequired: ["MongoDB", "NodeJS"],
      hourlyPay: 34,
      status: 1,
      createdBy: "Aman Pawar",
    },
    {
      name: "Anuvaad",
      description: "This is a tool to translate a textual image",
      tenureMonths: 2,
      skillsRequired: ["Python", "Tensorflow"],
      hourlyPay: 30,
      status: 2,
      createdBy: "Aman Pawar",
    },
    {
      name: "Face detection",
      description: "This is a software which detects faces in a video",
      tenureMonths: 2,
      skillsRequired: ["Python", "Image processing"],
      hourlyPay: 37,
      status: 1,
      createdBy: "Saurabh Mane",
    },
    {
      name: "Online auction system",
      description: "This is a website to sell items online in an auction",
      tenureMonths: 3,
      skillsRequired: ["Javascript", "ExpressJS", "ReactJS"],
      hourlyPay: 33,
      status: 3,
      createdBy: "Ameya Yadav",
    },
  ];

  let skills1 = [];
  let skills2 = [];

  try {
    let result = await skill.createSkill("ReactJS");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills1.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await skill.createSkill("MongoDB");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills1.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await skill.createSkill("Marketing Strategy");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills2.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await skill.createSkill("System Management");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills2.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await skill.createSkill("SQL");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills1.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await skill.createSkill("Html");
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
    skills2.push(result._id);
  } catch (error) {
    console.log(error);
    return;
  }

  //name, description, tenureMonths, skillsRequired, hourlyPay, status, createdBy
  try {
    let result = await project.createProject({
      name: "WorkForU",
      description: "This",
      tenureMonths: 3,
      skillsRequired: skills1,
      hourlyPay: 34,
      status: 1,
      createdBy: "Aman Pawar",
    });
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await project.createProject({
      name: "Anuvaad",
      description: "This is a tool to translate a textual image",
      tenureMonths: 2,
      skillsRequired: skills2,
      hourlyPay: 30,
      status: 2,
      createdBy: "Aman Pawar",
    });
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await project.createProject({
      name: "Face detection",
      description: "This is a software which detects faces in a video",
      tenureMonths: 2,
      skillsRequired: skills1,
      hourlyPay: 37,
      status: 1,
      createdBy: "Saurabh Mane",
    });
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    let result = await project.createProject({
      name: "Online auction system",
      description: "This is a website to sell items online in an auction",
      tenureMonths: 3,
      skillsRequired: skills2,
      hourlyPay: 33,
      status: 3,
      createdBy: "Ameya Yadav",
    });
    if (!result) {
      console.log("could not create");
      throw "some error";
    }
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
