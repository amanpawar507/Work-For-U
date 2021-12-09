const dbConnection = require("../config/mongoConnection");
const { skill, project, freelancer, employer } = require("../data");

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
      hrsPerDay: 6,
      daysPerWeek: 5,
    },
    {
      name: "Anuvaad",
      description: "This is a tool to translate a textual image",
      tenureMonths: 2,
      skillsRequired: ["Python", "Tensorflow"],
      hourlyPay: 30,
      status: 2,
      createdBy: "Aman Pawar",
      hrsPerDay: 5,
      daysPerWeek: 5,
    },
    {
      name: "Face detection",
      description: "This is a software which detects faces in a video",
      tenureMonths: 2,
      skillsRequired: ["Python", "Image processing"],
      hourlyPay: 37,
      status: 1,
      createdBy: "Saurabh Mane",
      hrsPerDay: 6,
      daysPerWeek: 4,
    },
    {
      name: "Online auction system",
      description: "This is a website to sell items online in an auction",
      tenureMonths: 3,
      skillsRequired: ["Javascript", "ExpressJS", "ReactJS"],
      hourlyPay: 33,
      status: 3,
      createdBy: "Ameya Yadav",
      hrsPerDay: 6,
      daysPerWeek: 5,
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

  let employer1;
  let employer2;

  try {
    let result = await employer.createEmployer({
      fullName: "Aman Pawar",
      emailId: "aman@gmail.com",
      password: "dcdvjcbd",
      companyName: "someCompany1",
    });
    console.log(result);
    employer1 = result;
  } catch (error) {
    console.log("from route: ", error);
    return;
  }

  try {
    let result = await employer.createEmployer({
      fullName: "Ameya Yadav",
      emailId: "ameya@gmail.com",
      password: "nkvbnkj",
      companyName: "someCompany2",
    });
    console.log(result);
    employer2 = result;
  } catch (error) {
    console.log("from route: ", error);
    return;
  }

  //name, description, tenureMonths, skillsRequired, hourlyPay, status, createdBy
  try {
    let result = await project.createProject({
      name: "WorkForU",
      description: "This is a B2B website for employers to hire freelancers",
      tenureMonths: 3,
      skillsRequired: skills1,
      hourlyPay: 34,
      createdBy: employer1._id,
      hrsPerDay: 6,
      daysPerWeek: 5,
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
      createdBy: employer2._id,
      hrsPerDay: 5,
      daysPerWeek: 5,
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
      createdBy: employer1._id,
      hrsPerDay: 6,
      daysPerWeek: 4,
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
      createdBy: employer2._id,
      hrsPerDay: 6,
      daysPerWeek: 5,
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
<<<<<<< HEAD
     await freelancer.createFreelancer({
      fullName:"Aman Pawar",
      emailId:"aman@gmail.com",
      password:"qwerty",
      introduction:"My name is Aman",
      skills:skills1,
      overallRating:5,
      reviews:"Abc",
      location:"New Jersey",
      successRate:3,
      expectedPay:34
    })

=======
    await freelancer.createFreelancer({
      fullName: "Aman Pawar",
      emailId: "aman@gmail.com",
      password: "qwerty",
      introduction: "My name is Aman",
      skills: skills1,
      overallRating: 5,
      reviews: "Abc",
      location: "USA",
      successRate: 3,
      expectedPay: 34,
    });
>>>>>>> edf13bc3c790a2b8f8a169a9efebc39c0f012041
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await freelancer.createFreelancer({
<<<<<<< HEAD
      fullName:"Rohan Naik",
      emailId:"rohan@gmail.com",
      password:"rohanQwerty",
      introduction:"My name is Rohan",
      skills:skills2,
      overallRating:4,
      reviews:"nbcjw",
      location:"New Jersey",
      successRate:4,
      expectedPay:30
    })
=======
      fullName: "Rohan Naik",
      emailId: "rohan@gmail.com",
      password: "rohanQwerty",
      introduction: "My name is Rohan",
      skills: skills2,
      overallRating: 4,
      reviews: "nbcjw",
      location: "USA",
      successRate: 4,
      expectedPay: 30,
    });
>>>>>>> edf13bc3c790a2b8f8a169a9efebc39c0f012041
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await freelancer.createFreelancer({
<<<<<<< HEAD
      fullName:"Vidhi Roy",
      emailId:"vidhi@gmail.com",
      password:"vidhiQwerty",
      introduction:"My name is Vidhi",
      skills:skills1,
      overallRating:4,
      reviews:"bncwbwd",
      location:"New Jersey",
      successRate:3,
      expectedPay:32
    })

=======
      fullName: "Vidhi Roy",
      emailId: "vidhi@gmail.com",
      password: "vidhiQwerty",
      introduction: "My name is Vidhi",
      skills: skills1,
      overallRating: 4,
      reviews: "bncwbwd",
      location: "USA",
      successRate: 3,
      expectedPay: 32,
    });
>>>>>>> edf13bc3c790a2b8f8a169a9efebc39c0f012041
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
