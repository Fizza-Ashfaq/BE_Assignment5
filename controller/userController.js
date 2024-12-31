const userModel=require('../model/userModel');
const bcrypt = require('bcryptjs');
const nodemailer=require("nodemailer");
const dotenv = require('dotenv');
dotenv.config({path: './mongoose.env'});
const jwt=require('jsonwebtoken');
//multer
//aws service s3
//websites-> medium ,rocketlogs
const reset_password=async(req,res)=>{
    const {email}=req.body;
    const user=await userModel.findOne({email:email});
    if(!user)
    {
        return res.status(404).send({message:"user not found"});
    }
    const OTP=Math.floor(10000+Math.random()*900000).toString();  
    user.OTP=OTP;
    user.OTPExpiry=Date.now()+3600000;
    await user.save(); 

    await sendMail(email,OTP);
    console.log('OTP sent successfully');
    res.status(200).send({message: "otp send successfully"});
}

const sendMail=async(email,OTP)=>{
    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    const info=await transporter.sendMail({
        from:process.env.EMAIL,
        to:email,
        subject:"password reset",
        text: `OTP:${OTP}`,
        html:`<h>OTP: <b>${OTP}<b></h>`
       })
    console.log('Message sent: %s', info);
      
}
const updatepass=async(req,res)=>
{
    try{
        const {email,otp,newPassword}=req.body;
        const user=await userModel.findOne({email: email});
        if(user.otp==otp)
        {
            const salt=10;
            const hashPassword=await bcrypt.hash(newPassword,salt);
            user.password = hashPassword;
            await user.save();
            console.log('Password updated successfully');
            res.status(200).send({message:`Password updated successfully`});
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
        const data=await userModel.findOne({email:req.body.email});
        console.log(data);
        if(!data){
            return res.status(404).send({ error: "user not found" });
        }
        else{
            console.log(req.body.password,'user found',data.password);
            const validate=await bcrypt.compare(req.body.password,data.password);
            if(validate)
            {
                const token=jwt.sign({id:data.id,role:data.role},'secret_key',{expiresIn:'2h'})
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
        const obj = await userModel.create(data);
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
        res.json({ "message": "users fetched successfully", users });
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
    const user=await user.findById(userId);
    if(userss.role != 'user')
        {
            return res.status(403).send({ error: "You are not authorized to access this resource" });
        }
    try{
    if(user){

        if(user.books.length>=3)
        {
            return res.status(400).send('user can borrow only 3 books');
        }
        else{
            if (user.books.includes(bookId)) {
                return res.status(400).send("<h1>Book already borrowed</h1>");
            }
                user.books.push(bookId);
                await user.save()
                return res.status(200).json({ message: "Book borrowed successfully.",user })
        }
    }
    else{
        return res.status(400).send('user not found');
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
    const user = await user.findById(userId);
    if(!user)
    {
        res.status(404).send("user not Found")
    }
    const bookIndex=user.books.indexOf(bookId);
    if(bookIndex === -1)
    {
        res.status(404).send("Book not found in the user's list");
        return;
    }
    user.books.splice(bookIndex,1);
    await user.save();
    console.log("Book returned successfully",user);
    res.status(200).json({message: "Book returned successfully", user});
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
    updatepass,
    reset_password,
}
