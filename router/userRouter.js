const express=require('express');

const authentication=require("../middleware/authen");
const router=express.Router();
const controller=require('../controller/userController');
router.post('/SignIn',controller.adduser);
router.get('/getoneuser/:id',authentication,controller.getoneuser);
router.put('/updateusers/:id',controller.updateuser);
router.delete('/deleteusers/:id',controller.deleteuser);
router.post('/user/:userId/borrowBook/:bookId',controller.borrowBook);
router.post('/user/:userId/returnBook/:bookId',controller.returnBook);
router.post('/login',controller.loginuser);
router.get('/allUser', authentication,controller.getuser);
router.post('/updatepassword',authentication,controller.updatepass);
module.exports=router;