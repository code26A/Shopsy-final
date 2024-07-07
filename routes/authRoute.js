import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPassword,
  updateProfileController,
  getOrdersController,
  getALLOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
//router object

const router = express.Router();

//routing
//register || Method POST

router.post("/register", registerController);
//forgot password
router.post("/forgot-password", forgotPassword);
//LOGIN || POST
router.post("/login", loginController);
//protected route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  return res.status(200).send({ ok: true });
});
router.put("/profile", requireSignIn, updateProfileController);
//orders
router.get("/orders", requireSignIn, getOrdersController);
//all orders
router.get("/all-orders", requireSignIn, isAdmin, getALLOrdersController);
//order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
