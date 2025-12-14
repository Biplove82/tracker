
const Project = require("../../modells/Project/projectModells");


const createProject = async (req, res) => {
  try {
    const body = req.body;

    const project = await Project.create(body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};


const getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      category,
      project_type,
    } = req.query;

    const filter = {};

    if (status) filter.project_status = status;
    if (category) filter.project_category = category;
    if (project_type) filter.project_type = project_type;

    if (search) {
      filter.$or = [
        { customer_name: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { project_name: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

 const getProjectById = async (req, res) => {
  try {
       let _id = req.params._id;
  

    const project = await Project.findById(_id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found"+error });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// -------------------------
// Update Project
// -------------------------
const updateProject = async (req, res) => {
  try {
    const updates = req.body;
      let _id = req.params._id;

    const project = await Project.findByIdAndUpdate(
      _id,
      updates,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// -------------------------
// Delete Project
// -------------------------
 const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params._id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// -------------------------
// Add Project Status History (important for solar CRM)
// -------------------------
const addProjectStatus = async (req, res) => {
  try {
    const { status, remarks, updated_by } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.status_history.push({
      status,
      remarks,
      updated_by,
    });

    project.project_status = status;
    project.updated_on = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};


module.exports={
    addProjectStatus,deleteProject,createProject,getProjects,updateProject,getProjectById
}