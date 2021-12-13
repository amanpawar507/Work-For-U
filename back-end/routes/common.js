const express = require("express");
const router = express.Router();
const data = require("../data");
const freelancerData = data.freelancer;
const employerData = data.employer;

router.post("/reCreate",async (req,res) => {
    try {
        const {user} = req.body;
        
        let result;
        if(user.reviews) {
            result = await freelancerData.getFreelancer(user._id);
        }else{
            result = await employerData.getEmployer(user._id);
        }
        res.json({user: result});
    } catch (error) {
        console.log("from data: ", error);
        res.status(404).json({ error: error.messsage ? error.message: error });
    }
})

module.exports = router;