const Projects = require("./projects-model");
const express = require("express");
const router = express.Router();
const { isValidId } = require("./projects-middleware");
//- [] `[GET] /api/projects`
//  - Returns an array of projects as the body of the response.
//  - If there are no projects it responds with an empty array.
//- [] `[GET] /api/projects/:id`
//  - Returns a project with the given `id` as the body of the response.
//  - If there is no project with the given `id` it responds with a status code 404.
//- [] `[POST] /api/projects`
//  - Returns the newly created project as the body of the response.
//  - If the request body is missing any of the required fields it responds with a status code 400.
//- [] `[PUT] /api/projects/:id`
//  - Returns the updated project as the body of the response.
//  - If there is no project with the given `id` it responds with a status code 404.
//  - If the request body is missing any of the required fields it responds with a status code 400.
//- [] `[DELETE] /api/projects/:id`
//  - Returns no response body.
//  - If there is no project with the given `id` it responds with a status code 404.
//- [] `[GET] /api/projects/:id/actions`
//  - Returns an array of actions (could be empty) belonging to a project with the given `id`.
//  - If there is no project with the given `id` it responds with a status code 404.

router.get("/", (req, res) => {
  Projects.get()
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((error) => {
      res.status(500).json({ message: "something went wrong here" });
    });
});

router.get("/:id", isValidId, (req, res, next) => {
  try {
    res.status(200).json(req.project);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res) => {
  const project = req.body;
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: "missing required name or description" });
    return;
  }
  Projects.insert(project)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      res.status(500).json({ message: "something went wrong here" });
    });
});

router.put("/:id", isValidId, async (req, res, next) => {
  const { name, description, completed } = req.body;
  if (!name || !description || !(completed != null)) {
    res.status(400).json({ message: "missing required name or description" });
    return;
  }
  const updatedProject = await Projects.update(req.params.id, req.body);
  res.status(200).json(updatedProject);
});

router.delete("/:id", isValidId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.json(res.Projects);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/actions", isValidId, async (req, res, next) => {
  Projects.getProjectActions(req.params.id)
    .then((actions) => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(200).json([]);
      }
    })
    .catch(next);
});

module.exports = router;
