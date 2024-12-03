const express=require('express');
const router=express.Router();
const controller=require('../controller/bookController');
router.post('/books',controller.addbook);
router.get('/getbooks',controller.getbook);
router.get('/getbooksbyid/:id',controller.getonebook);
router.put('/updatebooks/:id',controller.updatebook);
router.delete('/deletebooks/:id',controller.deletebook);

module.exports=router;