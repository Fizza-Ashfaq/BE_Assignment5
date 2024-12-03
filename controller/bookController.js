const book=require('../model/bookModel');
const addbook=async(req,res)=>{
    try {
        const data = req.body; 
        const obj = await book.create(data); 
        res.status(201).send(obj); 
      } catch (error) {
        console.error(error); 
        res.status(500).send({ error: "Failed to add book" }); 
      }
}
const getbook = async(req, res)=>{
    try{
        const data=await book.find({});
        res.status(200).send(data);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to get books" });
    }
}
const getonebook = async(req, res)=>{
    try{
        const id=req.params.id;
        const obj=await book.findById(id);
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to get book" });
    }
}

const updatebook=async(req,res)=>{
    try{
        const id=req.params.id;
        const data=req.body;
        const obj=await book.findByIdAndUpdate(id,data,{new:true});
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to update book" });
    }
}

const deletebook=async(req,res)=>{
    try{
        const id=req.params.id;
        const obj=await book.findByIdAndDelete(id);
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to delete book" });
    }
}

module.exports={
    addbook,
    getbook,
    getonebook,
    updatebook,
    deletebook
}
