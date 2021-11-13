const projectRoutes = require('./project');


const constructorMethod = (app) => {
app.use('/project', projectRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;