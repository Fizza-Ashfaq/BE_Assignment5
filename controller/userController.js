const user=require('../model/userModel');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path: './mongoose.env'});
const jwt=require('jsonwebtoken');
const updatepass=async(req,res)=>
{
    try{
        const users=await user.findOne({email: req.body.email});
        const validate=await bcrypt.compare(users.password, req.body.password);
        if(validate)
        {
            const salt=10;
            const newPassword=await bcrypt.hash(req.body.new_password,salt);
            users.password = newPassword;
            await users.save();
            console.log('Password updated successfully');
            res.status(200).send({message:"Password updated successfully"});
        }
        else{
            console.log('Invalid credentials');
            res.status(401).send("Invalid credentials");
        }
    }
    catch(err)
    {
        res.status(500).send({message:"internal error"});
    }
}
const loginuser=async(req,res)=>
{
    try{
        const data=await user.findOne({email:req.body.email});
        console.log(data);
        if(!data){
            return res.status(404).send({ error: "User not found" });
        }
        else{
            console.log(req.body.password,'User found',data.password);
            const validate=await bcrypt.compare(req.body.password,data.password);
            if(validate)
            {
                const token=jwt.sign(data._id.toString(),'secret_key',)
                console.log('Login Successful');
                res.status(200).send({message:"Login successful",token});
            }
            else{
                console.log('Invalid credentials');
                res.status(401).send("Invalid credentials");
            
            }
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({ error: "Failed to login" });
    }
}
const adduser=async(req,res)=>{
    try {
        const data = req.body;
        const obj = await user.create(data);
        const salt=10;
        const hashedPassword=await bcrypt.hash(data.password,salt);
        obj.password = hashedPassword;
       obj.save()
        res.status(201).send(obj); 
      } catch (error) {
        console.error(error); 
        res.status(500).send({ error: "Failed to add user" }); 
      }
}
const getuser = async(req, res)=>{
    try{
        console.log(req.user);
        const userss=await user.findById(req.user.id);
        if(userss.role!=="admin"){
            return res.status(403).send({ error: "You are not authorized to access this resource" });
        }
        const users = await user.find();  
        res.json({ "message": "Users fetched successfully", users });
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to get users" });
    }
}
const getoneuser = async(req, res)=>{
    try{
        const id=req.params.id;
        // const book=await Book.findById(id);
        const userss=await user.findById(req.user.id);
        if(userss.role!="admin"){
            return res.status(403).send({ error: "You are not authorized to access this resource" });
        }
        const obj=await user.findById(id).populate('books');
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to get user" });
    }
}

const updateuser=async(req,res)=>{
    try{
        const id=req.params.id;
        const userss = await user.findById(req.user.id);
        if(userss.role != 'user')
            {
                return res.status(403).send({ error: "You are not authorized to access this resource" });
            }
        const data=req.body;
        const obj=await user.findByIdAndUpdate(id,data,{new:true});
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to update user" });
    }
}

const deleteuser=async(req,res)=>{
    try{
        const id=req.params.id;
        const userss = await user.findById(req.user.id);
        if(userss.role=="admin"){
            return res.status(403).send({ error: "You are not authorized to access this resource" });
        }
        const obj=await user.findByIdAndDelete(id);
        res.status(200).send(obj);
    }
    catch(error){
        console.error(error);
        res.status(500).send({ error: "Failed to delete user" });
    }
}

const borrowBook=async(req,res)=>{
    const {userId,bookId}=req.params;
    const User=await user.findById(userId);
    if(userss.role != 'user')
        {
            return res.status(403).send({ error: "You are not authorized to access this resource" });
        }
    try{
    if(User){

        if(User.books.length>=3)
        {
            return res.status(400).send('User can borrow only 3 books');
        }
        else{
            if (User.books.includes(bookId)) {
                return res.status(400).send("<h1>Book already borrowed</h1>");
            }
                User.books.push(bookId);
                await User.save()
                return res.status(200).json({ message: "Book borrowed successfully.",User })
        }
    }
    else{
        return res.status(400).send('User not found');
    }}
    catch(error){
        console.error(error);
        res.status(500).send(error );
    }
}
const returnBook = async(req, res) => {
    try{
    const { userId,bookId } = req.params;
    const userss = await user.findById(req.user.id);
    if(userss.role != 'user')
    {
        return res.status(403).send({ error: "You are not authorized to access this resource" });
    }
    const User = await user.findById(userId);
    if(!User)
    {
        res.status(404).send("User not Found")
    }
    const bookIndex=User.books.indexOf(bookId);
    if(bookIndex === -1)
    {
        res.status(404).send("Book not found in the User's list");
        return;
    }
    User.books.splice(bookIndex,1);
    await User.save();
    console.log("Book returned successfully",User);
    res.status(200).json({message: "Book returned successfully", User});
    }

catch (error)
{
    console.error(error);
}
}
module.exports={
    returnBook,
   borrowBook,
   adduser,
    getuser,
    getoneuser,
    updateuser,
    deleteuser,
    loginuser,
    updatepass
}
