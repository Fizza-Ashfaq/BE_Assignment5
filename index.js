const express=require('express');
const mongoose=require('mongoose');
const app=express();
app.use(express.json());
const dotenv=require('dotenv');
dotenv.config({ path: './mongoose.env' });
const url=process.env.URL;

mongoose.connect(url).then(()=>console.log('mongodb'));

const userRouter=require("./router/userRouter");
const bookRouter=require("./router/bookRouter");
app.use('/user',userRouter);
app.use('/books', bookRouter);
const port=process.env.PORT;
app.listen(port,()=>
{
    console.log("server listening on port " + port);
});

// {
//     "email":"alia123@gmail.com",
//     "password":"alia123",
//     "new_password":"alia12345"
// }