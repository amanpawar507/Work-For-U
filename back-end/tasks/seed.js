const dbConnection = require("../config/mongoConnection");
const { skill, project, freelancer, employer } = require("../data");

async function main() {
  var twirlTimer = (function () {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function () {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
  })();
  const db = await dbConnection();
  await db.dropDatabase();

  // const skills = [
  //   "ReactJS",
  //   "MongoDB",
  //   "Marketing Strategy",
  //   "System Management",
  //   "SQL",
  //   "HTML",
  //   "Bootstrap",
  //   "NextJS",
  //   "Javascript",
  //   "Java",
  //   "Python",
  //   "Business Intelligence",
  //   "Data Warehousing",
  //   "Algorithms",
  //   "Deep Learning",
  //   "Data Visualization",
  //   "Data Analysis",
  //   "ETL (Extract, Transform, Load)",
  //   "PL/SQL",
  //   "R Programming",
  //   "SQL Server Reporting Services(SSRS)",
  //   "SQL Server Integration Services(SSIS)",
  //   "Oracle SQL",
  //   "C++",
  //   "C",
  //   "Linux"
  // ];

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
    let result = await skill.createSkill("HTML");
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
    let result = await skill.createSkill("CSS");
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
    let result = await skill.createSkill("Networking");
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
  let result = await skill.createSkill("Bootstrap");
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
  let result = await skill.createSkill("NextJS");
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
  let result = await skill.createSkill("Javascript");
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
  let result = await skill.createSkill("Java");
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
  let result = await skill.createSkill("Python");
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
  let result = await skill.createSkill("Business Intelligence");
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
  let result = await skill.createSkill("Data Warehousing");
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
  let result = await skill.createSkill("Algorithms");
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
  let result = await skill.createSkill("Deep Learning");
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
  let result = await skill.createSkill("Data Visualization");
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
  let result = await skill.createSkill("Data Analysis");
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
  let result = await skill.createSkill("ETL (Extract, Transform, Load)");
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
  let result = await skill.createSkill("PL/SQL");
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
  let result = await skill.createSkill("R Programming");
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
  let result = await skill.createSkill("SQL Server Reporting Services(SSRS)");
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
  let result = await skill.createSkill("SQL Server Integration Services(SSIS)");
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
let result = await skill.createSkill("Oracle SQL");
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
let result = await skill.createSkill("C++");
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
let result = await skill.createSkill("C");
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
let result = await skill.createSkill("Linux");
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
      password: "aman1234",
      companyName: "someCompany1",
    });
    employer1 = result;
  } catch (error) {
    console.log("from route: ", error);
    return;
  }

  try {
    let result = await employer.createEmployer({
      fullName: "Ameya Yadav",
      emailId: "ameya@gmail.com",
      password: "ameya1234",
      companyName: "someCompany2",
    });
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
    await freelancer.createFreelancer({
      fullName: "Joe Ray",
      emailId: "joe@gmail.com",
      password: "joe1234",
      introduction: "My name is Joe",
      skills: skills1,
      location: "Alabama",
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
      password: "joe1234",
      introduction: "My name is Rohan",
      skills: skills2,
      location: "New York",
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
      password: "vidhi1234",
      introduction: "My name is Vidhi",
      skills: skills1,
      location: "Ohio",
      expectedPay: 32,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    await freelancer.createFreelancer({
      fullName: "Emma Sul",
      emailId: "emma@gmail.com",
      password: "emma1234",
      introduction: "My name is Emma",
      skills: skills1,
      location: "Virginia",
      expectedPay: 32,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  console.log("Done seeding database");

  await db.s.client.close();

  clearInterval(twirlTimer);
}

try {
  main();
} catch (error) {
  console.log(error);
}
