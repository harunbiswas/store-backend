// add movie
const express = require('express')
const { addMovie } = require('../controller/movieController')
const authGuard = require('../middleware/authGuard')

const router = express.Router()


// add route
router.post('/add',authGuard, addMovie)









// export the module
module.exports = router