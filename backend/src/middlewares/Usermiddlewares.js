import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const VerifyJwt = async (req, res, next) => {
   try {
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: "Unauthorization" });
      }

      const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodeToken._id).select("-password");

      if (!user) {
         return res
            .status(401)
            .json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
   } catch (error) {
    console.error("JWT Error:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export { VerifyJwt };
