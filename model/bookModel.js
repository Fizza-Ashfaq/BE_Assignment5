const mongoose=require('mongoose');
const {Schema} = require('mongoose');
const bookSchema=new Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    year:{type:Number, required:false},
    genre:{type:String, required:true},
    summary:{type:String, required:false},
});
const Book=mongoose.model('Book',bookSchema);
module.exports=Book;