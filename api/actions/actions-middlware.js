const Action = require("./actions-model");

async function isValidId(req, res, next) {
  try {
    const action = await Action.get(req.params.id);
    if (!action) {
      res.status(404).json({ message: "No actions were found with that ID" });
    } else {
      req.action = action;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "error occurred" });
  }
}

module.exports = { isValidId };
