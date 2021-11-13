const express = require('express');
const router = express.Router();
const {skill} = require('../data');

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

        let result = await skill.createSkill(name);
        if(result) {
            res.status(200).json({message: "skill added successfully"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.messsage});
    }
});

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