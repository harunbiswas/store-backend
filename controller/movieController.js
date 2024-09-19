const Movies = require("../models/Movies")


// add router
const addMovie=async (req, res)=> {
    try{
        const movie =new Movies(req.body)
        const result = await movie.save()
        res.status(200).json(result)
    }catch(err){
        res.status(500).json("Internal server Error")
    }
}


module.exports={addMovie}