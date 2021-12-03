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



app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));


app.use((req,res,next) => {
  console.log('Current Timestamp: ', new Date().toUTCString());
  console.log('Request Method: ', req.method);
  console.log('Request Route: ', req.originalUrl);
  console.log(`User is${req.session.email ? "" : " not"} authenticated`)

  next();
})


configRoutes(app);
app.listen(5000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:5000');
});