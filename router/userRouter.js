const express=require('express');

const {authentication,authorization}=require("../middleware/authen");
const router=express.Router();
const controller=require('../controller/userController');
router.post('/SignIn',controller.adduser);
router.get('/getoneuser/:id',authentication,controller.getoneuser);
router.put('/updateusers/:id',authentication,controller.updateuser);
router.delete('/deleteusers/:id',authentication,controller.deleteuser);
router.post('/user/:userId/borrowBook/:bookId',authentication,controller.borrowBook);
router.post('/user/:userId/returnBook/:bookId',authentication,controller.returnBook);
router.post('/login',controller.loginuser);
router.get('/allUser/:id', authentication,authorization("admin"),controller.getuser);
router.post('/updatepassword',controller.updatepass);
router.post('/resetpassword',controller.reset_password);
module.exports=router;