const projectRoutes = require("./project");
const freelancerRoutes = require("./freelancer");
const employerRoutes = require("./employer");
const skillRoutes = require("./skill");

const constructorMethod = (app) => {
  app.use("/project", projectRoutes);
  app.use("/freelancer", freelancerRoutes);
  app.use("/employer", employerRoutes);
  app.use("/skills", skillRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
