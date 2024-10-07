const Movies = require("../models/Movies")
const mongoose = require('mongoose')


// add  movie
const addMovie=async (req, res)=> {
    try{
        const movie =new Movies(req.body)
        const result = await movie.save()
        res.status(200).json(result)
    }catch(err){
        res.status(500).json("Internal server Error")
    }
}

// get movies 
const getMovies=async (req, res)=> {
    try{
       
        const result = await Movies.find()
        res.status(200).json(result)
    }catch(err){
        res.status(500).json("Internal server Error")
    }
}


// get single movie 
const getMovie = async (req, res) => {
    try {
      const { id } = req.query;

      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      // Fetch the movie by ID
      const result = await Movies.findById(id);
  
      // If the movie is not found, return a 404 response
      if (!result) {
      
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// get single movie by imdb id
  const getMovieIID = async (req, res) => {
    try {
      const { imdbID } = req.query;

   
      // Fetch the movie by ID
      const result = await Movies.find({imdbID});
  
      // If the movie is not found, return a 404 response
      if (!result) {
      
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


module.exports={addMovie, getMovies, getMovie, getMovieIID}