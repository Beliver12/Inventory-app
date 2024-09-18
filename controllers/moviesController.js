const { json } = require("express");
const fetch = require('node-fetch');
const moviesStorage = require("../db/pool");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const dateErr = "must be correct.";



let moviedata;
  let movieinfo = [];

exports.usersListGet = async (req, res) => {
  
  async function fetchData() {
  
    const url = 'https://api.themoviedb.org/3/configuration';
   const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDk1NzRiNTJhMDk3Mjk3YmM4MTQ5OTIyNjE4NDM1NiIsIm5iZiI6MTcyNjU4MDM2My4yMjA5NjksInN1YiI6IjY2ZTU3NTY0ZmIzOTE0ZTI1NWZkNjRmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F-2eAKcJ-v4h26A7N4rmlbWSxTcZ4ts4A_JVtCwbZHM'
  }
};
    try {
      const response = await fetch(url, options);
      const result = await response.json();
     // console.log(result);
      moviedata = result;
    } catch (error) {
      throw new Error("Error fetching data:" + error);
    }
  }
 await fetchData();
  async function fetchData2() {
  for(let i = 1; i < 200; i++) {
    const url = `https://api.themoviedb.org/3/discover/movie?query=include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc`;
  
   const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDk1NzRiNTJhMDk3Mjk3YmM4MTQ5OTIyNjE4NDM1NiIsIm5iZiI6MTcyNjU4MDM2My4yMjA5NjksInN1YiI6IjY2ZTU3NTY0ZmIzOTE0ZTI1NWZkNjRmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F-2eAKcJ-v4h26A7N4rmlbWSxTcZ4ts4A_JVtCwbZHM'
  }
};
    try {
      const response = await fetch(url, options);
      const result = await response.json();
     // console.log(result);
      movieinfo.push(result);
    } catch (error) {
      throw new Error("Error fetching data:" + error);
    }
  }
  }
 
 await fetchData2();
    const movies = await moviesStorage.query("SELECT * FROM movies")
    console.log(movies)
    res.render("index", {
      title: "User list",
      movies: movies.rows,
      moviedata: moviedata.images,
      movieinfo: movieinfo,
    });
    console.log(movieinfo.length)
    
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
    
   await moviesStorage.query("INSERT INTO movies (title, year, director, genre, actor) VALUES ($1, $2, $3, $4, $5)", 
                            [req.body.title, req.body.year, req.body.director, req.body.genre, req.body.actor]);
                     res.redirect("/")                        
  }
]

exports.movieCategoryGet = async (req, res) => {
  const category = await moviesStorage.query("SELECT * FROM movies WHERE genre = $1 ", [req.params.genre]);
  console.log(category);
  res.render("category", {title: "Category Details", category: category.rows,  moviedata: moviedata.images,
  movieinfo: movieinfo.results,});
}