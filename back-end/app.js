const express = require('express');
const app = express();
var cors = require("cors");
const session = require('express-session');
var options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(options));

const configRoutes = require('./routes');

app.use(express.json());

configRoutes(app);

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));

app.listen(5000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:5000');
});