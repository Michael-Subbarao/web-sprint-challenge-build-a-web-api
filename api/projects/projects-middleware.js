const Project = require("./projects-model");

async function isValidId(req, res, next) {
  try {
    const project = await Project.get(req.params.id);
    if (!project) {
      res.status(404).json({ message: "No projects were found with that ID" });
    } else {
      req.project = project;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "error occurred" });
  }
}

module.exports = { isValidId };
