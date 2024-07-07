import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProduct,
  getCountOfAllProducts,
  getProductController,
  getsingleProductController,
  productCategoryController,
  productFilterController,
  productListController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
const router = express.Router();

//routes
router.post("/create-product", requireSignIn, isAdmin, createProductController);
//get products
router.get("/get-product", getProductController);
//get single product
router.get("/get-product/:slug", getsingleProductController);
//delete product
router.delete("/delete-product/:id", requireSignIn, isAdmin, deleteProduct);
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  updateProductController
);
//filter product
router.post("/product-filter", productFilterController);
//product count
router.get("/product-count", getCountOfAllProducts);
//product pre page
router.get("/product-list/:page", productListController);
//search product
router.get("/search/:key", searchProductController);
//similar product
router.get("/related-product/:pid/:cid", relatedProductController);
//product category controller
router.get("/product-category/:slug", productCategoryController);
//payment route
router.get("/braintree/token", braintreeTokenController);
//payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
