
const moviesStorage = require("../db/pool");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const dateErr = "must be correct.";

const validateMovie = [
  body("year").trim().isDate().withMessage(`Year ${dateErr}`),
  body("genre").trim().isAlpha().withMessage(`Genre ${alphaErr}`),
];

let movies;
let moviesCategory = [];

exports.usersListGet = async (req, res) => {
  //await moviesStorage.query("DROP TABLE movies")
     movies = await moviesStorage.query("SELECT * FROM movies2 ORDER BY id ASC");
      
     movies.rows.forEach((row) => {
      
      if(!moviesCategory.includes(row.genre))
      moviesCategory.push(row.genre)
      //console.log(moviesCategory);
     })
    console.log(moviesCategory[1])
    res.render("index", {
      title: "User list",
      movies: movies.rows,
      moviesCategory: moviesCategory,
    });

    
  };

exports.moviesCreateGet = (req, res) => {
  res.render("createMovies", {
    title: "Create movie",
  })
}

exports.movieUpdateGet = (req, res) => {
  res.render("updateMovies", {
    title: "Update Movie",
    movies: movies.rows,
    id: req.params.id - 1,
  })
}



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
    
   await moviesStorage.query("INSERT INTO movies2 (title, year, director, genre, actor, url) VALUES ($1, $2, $3, $4, $5, $6)", 
                            [req.body.title, req.body.year, req.body.director, req.body.genre, req.body.actor, req.body.url]);
                     res.redirect("/")                        
  }
]

exports.movieUpdatePost = [
  validateMovie,
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).render("updateMovies", {
        title: "Update Movie",
        errors: errors.array(),
      });
    }
    await moviesStorage.query("UPDATE movies2 SET title = $1, year = $2, director = $3, genre = $4, actor = $5, url = $6 WHERE title = $7",
    [req.body.title, req.body.year, req.body.director, req.body.genre, req.body.actor, req.body.url, req.params.id] )
  const update = await moviesStorage.query("SELECT * FROM movies2")
    console.log(update)
    res.redirect("/")
  }
]

exports.movieCategoryGet = async (req, res) => {
  const category = await moviesStorage.query("SELECT * FROM movies2 WHERE genre = $1 ", [req.params.genre]);
  console.log(category);
  res.render("category", {title: req.params.genre, category: category.rows,});
}

exports.movieDeletePost = async (req, res) => {
  await moviesStorage.query("DELETE FROM movies2 WHERE id = $1", [req.params.id])
  moviesCategory = [];
  const update = await moviesStorage.query("SELECT * FROM movies2")
    console.log(update)
    res.redirect("/")
}

exports.categoryDeletePost = async (req, res) => {
  await moviesStorage.query("DELETE FROM movies2 WHERE genre = $1", [req.params.genre])
  moviesCategory = [];
  const update = await moviesStorage.query("SELECT * FROM movies2")
    console.log(update)
    res.redirect("/")
}