const { Router } = require("express");
const moviesController = require("../controllers/moviesController");
const moviesRouter = Router();

moviesRouter.get("/", moviesController.usersListGet);
moviesRouter.get("/create", moviesController.moviesCreateGet);
moviesRouter.get("/update/:id", moviesController.movieUpdateGet)
moviesRouter.post("/update/:id", moviesController.movieUpdatePost)
moviesRouter.post("/create", moviesController.moviesCreatePost);
moviesRouter.get("/category/:genre", moviesController.movieCategoryGet)
moviesRouter.post("/delete/:id", moviesController.movieDeletePost)
moviesRouter.post("/deleteCategory/:genre", moviesController.categoryDeletePost)
module.exports = moviesRouter;