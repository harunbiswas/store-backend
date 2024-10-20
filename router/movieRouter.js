// add movie
const express = require('express')
const { addMovie, getMovies, getMovie, getMovieIID } = require('../controller/movieController')
const authGuard = require('../middleware/authGuard')

const router = express.Router()


// add route
router.post('/add',authGuard, addMovie)
router.get('/gets', getMovies)
router.get('/get', getMovie)
router.get('/get/imdbid',authGuard, getMovieIID)









// export the module
module.exports = router