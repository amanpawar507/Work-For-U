const dbConnection = require("../config/mongoConnection");
const { skill, project, freelancer } = require("../data");

async function main() {
  const db = await dbConnection();
  //   await db.dropDatabase();

  try {
    await freelancer.createFreelancer({
      fullName: "Aman Pawar",
      emailId: "aman@gmail.com",
      password: "qwerty",
      introduction: "My name is Aman",
      skills: ["61995a7b14103374949cc0e0", "61995a7b14103374949cc0e1"],
      overallRating: 5,
      reviews: "Abc",
      location: "USA",
      successRate: 3,
      expectedPay: 34,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await freelancer.createFreelancer({
      fullName: "Rohan Naik",
      emailId: "rohan@gmail.com",
      password: "rohanQwerty",
      introduction: "My name is Rohan",
      skills: ["61995a7b14103374949cc0e0", "61995a7b14103374949cc0e1"],
      overallRating: 4,
      reviews: "nbcjw",
      location: "USA",
      successRate: 4,
      expectedPay: 30,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await freelancer.createFreelancer({
      fullName: "Vidhi Roy",
      emailId: "vidhi@gmail.com",
      password: "vidhiQwerty",
      introduction: "My name is Vidhi",
      skills: ["61995a7b14103374949cc0e0", "61995a7b14103374949cc0e1"],
      overallRating: 4,
      reviews: "bncwbwd",
      location: "USA",
      successRate: 3,
      expectedPay: 32,
    });
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
