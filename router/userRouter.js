const express=require('express');
const router=express.Router();
const controller=require('../controller/userController');
router.post('/users',controller.adduser);
router.get('/getusers',controller.getuser);
router.get('/getoneuser/:id',controller.getoneuser);
router.put('/updateusers/:id',controller.updateuser);
router.delete('/deleteusers/:id',controller.deleteuser);
router.post('/user/:userId/borrowBook/:bookId',controller.borrowBook);
router.post('/user/:userId/returnBook/:bookId',controller.returnBook);
router.post('/login',controller.loginuser);

module.exports=router;