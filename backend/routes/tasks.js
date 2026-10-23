const express = require("express");
const router = express.Router();

const generateTasks = require("../services/bedrock");

router.post("/generate",
async (req,res)=>{

  const { goal } = req.body;

  const result =
    await generateTasks(goal);

  res.json(result.tasks);
});

module.exports = router;