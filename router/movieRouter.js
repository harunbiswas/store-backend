// add movie
const express = require('express')
const { addMovie, getMovies, getMovie } = require('../controller/movieController')
const authGuard = require('../middleware/authGuard')

const router = express.Router()


// add route
router.post('/add',authGuard, addMovie)
router.get('/gets',authGuard, getMovies)
router.get('/get',authGuard, getMovie)









// export the module
module.exports = router