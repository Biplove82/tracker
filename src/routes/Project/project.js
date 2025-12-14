const router = require("express").Router();


const { createProject, getProjects, getProjectById, updateProject, deleteProject }=require("../../controllers/project/project");

router.post("/create-project",createProject);
router.get("/get-project",getProjects);
router.get("/getProjectById/:_id",getProjectById);
router.put("/update-project/:_id", updateProject);
router.delete("/delete-project/:_id",deleteProject);

module.exports = router;
