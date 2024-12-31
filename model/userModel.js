const mongoose=require('mongoose');
const {Schema} = require('mongoose');
const userSchema=new Schema({
    name:{ type:String, required:true},
    email: { type:String, required:true, unique: true},
    password: { type:String, required:true},
    age: Number, 
    role : { 
        type:String,
         required:true,
        enum:["user", "admin"]
    },
    createdAt: { type:Date, default:Date.now},
    books:[{
        type:Schema.Types.ObjectId,
        ref:"Book",
        required:false
    }],
    OTP:{type:Number, required:false}
}); 

const user=mongoose.model('User',userSchema);
module.exports = user;








//localhost:8000/user/user/67419a3f6ccbe8a590017d0f/borrowBook/67457e1181cf2caa31089a9c
//jwtio