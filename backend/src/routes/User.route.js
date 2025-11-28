import express from "express";
import {
   UserRegister,
   Login,
   CurrentUser,
   Logout,
   verifyOtp,
   resendOtp,
   requestPasswordReset,
   passwordOtp,
   NewPassword,
   updateProfile,
} from "../controllers/userControllers.js";
import { VerifyJwt } from "../middlewares/Usermiddlewares.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", Login);
router.post("/currentuser", VerifyJwt, CurrentUser);
router.post("/verfiyOpt", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/logout", Logout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/verifyPasswordOtp", passwordOtp);
router.post("/newPassword", NewPassword);
router.put("/updateProfile", VerifyJwt, updateProfile);

export default router;
