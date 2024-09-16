const { Router } = require("express");
const moviesController = require("../controllers/moviesController");
const moviesRouter = Router();

moviesRouter.get("/", moviesController.usersListGet);
moviesRouter.get("/create", moviesController.moviesCreateGet);
moviesRouter.post("/create", moviesController.moviesCreatePost);
moviesRouter.get("/category/:genre", moviesController.movieCategoryGet)
module.exports = moviesRouter;