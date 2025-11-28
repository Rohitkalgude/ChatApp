import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import responseHandler from "../services/responseHandler.js";

const VerifyJwt = async (req, res, next) => {
   try {
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      console.log("Token received:", token);

      if (!token) {
         return responseHandler(res, 401, false, "Unauthorization request");
      }

      const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded token:", decodeToken);

      const user = await User.findById(decodeToken?._id).select("-password");

      if (!user) {
         return responseHandler(res, 401, false, "User not found");
      }
      console.log("Verified user:", user);

      req.user = user;
      next();
   } catch (error) {
      console.log("JWT error:", error.message); 
      return responseHandler(
         res,
         401,
         false,
         "Invalid Access Token",
         error.message
      );
   }
};

export { VerifyJwt };
