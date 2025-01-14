const Category = require("../models/Catagory");


// catagory
const addCatagoryController = async(req, res)=>{
  try{
    const {name}  = req.body;

    const newCat = new Category({name})
    
    const result = await newCat.save()

    res.status(200).json(result)

  }catch(e){
    console.log(e)
    res.status(500).json("Internal server error")
  }
}


// getCatagory
const getCatagoryController = async(req, res )=>{
    try{
        const result = await Category.find();
        res.status(200).json(result)
    }catch(e){
        console.log(e)
        res.statu
    }
}





module.exports = {addCatagoryController, getCatagoryController}