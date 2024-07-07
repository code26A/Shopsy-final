import express from 'express'
import { requireSignIn,isAdmin } from '../middleware/authMiddleware.js';
import { categoryControllers, createCategoryController, deleteCategory, singleCategory, updateCategoryController } from '../controller/categoryController.js';
//router object

const  router = express.Router();


//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);
//get all category
router.get('/categories',categoryControllers);
//get single category
router.get('/single-categories/:slug',singleCategory);
//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategory)
export default router;