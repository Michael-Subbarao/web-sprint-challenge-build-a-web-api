const Actions = require("./actions-model");
const express = require("express");
const router = express.Router();
const {isValidId} = require("./actions-middlware")

//- [ ] `[GET] /api/projects`
//  - Returns an array of projects as the body of the response.
//  - If there are no projects it responds with an empty array.
//- [ ] `[GET] /api/projects/:id`
//  - Returns a project with the given `id` as the body of the response.
//  - If there is no project with the given `id` it responds with a status code 404.
//- [ ] `[POST] /api/projects`
//  - Returns the newly created project as the body of the response.
//  - If the request body is missing any of the required fields it responds with a status code 400.
//- [ ] `[PUT] /api/projects/:id`
//  - Returns the updated project as the body of the response.
//  - If there is no project with the given `id` it responds with a status code 404.
//  - If the request body is missing any of the required fields it responds with a status code 400.
//- [ ] `[DELETE] /api/projects/:id`
//  - Returns no response body.
//  - If there is no project with the given `id` it responds with a status code 404.
//- [ ] `[GET] /api/projects/:id/actions`
//  - Returns an array of actions (could be empty) belonging to a project with the given `id`.
//  - If there is no project with the given `id` it responds with a status code 404.

router.get('/', async (req, res, next) => {
    try{
        const actions = await Actions.get()
        res.status(200).json(actions);
    } catch(error) {
        next(error);
    }
})

router.get("/:id", isValidId, async (req, res, next) => {
    try{
        res.status(200).json(req.action);
    } catch(error){
        next(error);
    }
})

router.post("/", async (req, res, next) => {
    const {project_id, description, notes} = req.body
    if(!project_id || !notes || !notes.trim || !description){
        res.status(400).json({message: 'missing required project id, notes, or description'})
        return;
    }
    try{
        const action = await Actions.insert(req.body);
        res.status(201).json(action);
    } catch(error){
        next(error);
    }
})

router.put("/:id", isValidId, async (req, res) => {
    const {project_id, description, notes} = req.body
    if(!project_id || !notes || !notes.trim || !description){
        res.status(400).json({message: 'missing required project id, notes, or description'})
        return;
    }
    const updatedAction = await Actions.update(req.params.id, req.body)
    res.status(200).json(updatedAction);
})

router.delete("/:id", isValidId, async (req, res, next) => {
    try{
        await Actions.remove(req.params.id)
        res.json(res.Action)
    } catch(error){
        next(error)
    }
})

module.exports = router;