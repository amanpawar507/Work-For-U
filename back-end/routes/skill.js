const express = require('express');
const router = express.Router();
const {skill} = require('../data');

//-----------------------------------------createskill---------------------------------------------------------

router.post('/', async (req,res) => {
    try {
        const {name} = req.body;
        if(!name) {
            res.status(400).json({error: "provide a name for the skill"});
            return;
        }
        if(typeof name !== "string") {
            res.status(400).json({error: "invalid type of input"});
            return;
        }

        if (name.trim().length === 0) {
            res.status(400).json({ error: "empty spaces for input" });
            return;
          }

        let result = await skill.createSkill(name);
        if(result) {
            res.status(200).json({message: "skill added successfully"});
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({error: error.messsage});
    }
});

//-----------------------------------------getAllSkills---------------------------------------------------------

router.get("/", async(req,res) => {
    try {
        let result = await skill.getAllSkills();
        if(result) {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({error: error.messsage? error.message:error});
    }
})

// router.get('/:id', async (req,res) => {
//     try {
//         const {name} = req.body;
//         if(!name) {
//             res.status(400).json({error: "provide a name for the skill"});
//             return;
//         }
//         if(typeof name !== "string") {
//             res.status(400).json({error: "invalid type of input"});
//             return;
//         }

//         let result = await skill.createSkill(name);
//         if(result) {
//             res.status(200).json({message: "skill added successfully"});
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error: error.messsage});
//     }
// });

module.exports = router;