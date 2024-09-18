
const moviesStorage = require("../db/pool");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const dateErr = "must be correct.";




exports.usersListGet = async (req, res) => {
  
    const movies = await moviesStorage.query("SELECT * FROM movies")
    console.log(movies)
    res.render("index", {
      title: "User list",
      movies: movies.rows,
    });

    
  };

exports.moviesCreateGet = (req, res) => {
  res.render("createMovies", {
    title: "Create movie",
  })
}

const validateMovie = [
   body("year").trim().isDate().withMessage(`Year ${dateErr}`),
   body("genre").trim().isAlpha().withMessage(`Genre ${alphaErr}`),
];

exports.moviesCreatePost = [
  validateMovie,
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("createMovies", {
        title: "Create movie",
        errors: errors.array(),
      });
    }
    
   await moviesStorage.query("INSERT INTO movies (title, year, director, genre, actor, url) VALUES ($1, $2, $3, $4, $5, $6)", 
                            [req.body.title, req.body.year, req.body.director, req.body.genre, req.body.actor, req.body.url]);
                     res.redirect("/")                        
  }
]

exports.movieCategoryGet = async (req, res) => {
  const category = await moviesStorage.query("SELECT * FROM movies WHERE genre = $1 ", [req.params.genre]);
  console.log(category);
  res.render("category", {title: "Category Details", category: category.rows,});
}