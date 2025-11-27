import express from "express";
import {
   Register,
   Login,
   CurrentUser,
   Logout,
   verifyOtp,
   resendOtp,
   requestPasswordReset,
   passwordOtp,
   NewPassword,
   updateProfile,
} from "../controllers/UserControllers.js";
import { VerifyJwt } from "../middlewares/Usermiddlewares.js";

const router = express.Router();

router.post("/register", Register);
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
