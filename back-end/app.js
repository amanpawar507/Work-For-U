const express = require('express');
const app = express();
var cors = require("cors");
const {verifyUser} = require("./middlewares/JWT");
var options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(options));

const configRoutes = require('./routes');
const { getFreelancer } = require('./data/freelancer');
const { getEmployer } = require('./data/employer');

app.use(express.json());





app.use((req,res,next) => {
    console.log('Current Timestamp: ', new Date().toUTCString());
    console.log('Request Method: ', req.method);
    console.log('Request Route: ', req.originalUrl);
    next();
    // console.log(`User is${req.session.email ? "" : " not"} authenticated`)
})

app.use("/common/reCreate",async(req,res,next) => {
  try {
    console.log(req.headers);
    console.log(req.headers.accesstoken);
    let user = verifyUser(req.headers.accesstoken);
    req.body.user = user;
    next();
    console.log(req)
  } catch (error) {
    console.log(error);
    res.status(401).json({error: "Unauthorized access!"})
  }
  // console.log(`User is${req.session.email ? "" : " not"} authenticated`)
})

app.use((req,res,next) => {
  try{
    // if(!req.headers.accessToken) next();
    if(req.originalUrl !== "/employer/login" &&
    req.originalUrl !== "/freelancer/login" &&
    (req.originalUrl !== "/employer/" && req.method !== "POST") &&
    (req.originalUrl !== "/freelancer/" && req.method !== "POST") &&
    req.originalUrl !== "/reCreate" &&
    req.originalUrl !== "/skills/" 
    ) {
      verifyUser(req.headers.accesstoken)
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({error: "Unauthorized access!"})
  }
})

configRoutes(app);
app.listen(5000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:5000');
});