import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
      },
      fullName: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 6,
      },
      profilePic: {
         type: String,
         default: "",
      },
      bio: {
         type: String,
      },
      emailOtp: {
         type: Number,
         default: null,
         index: true,
      },
      emailOtpExpiry: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcryptjs.hash(this.password, 10);
   next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

export const User = mongoose.model("User", userSchema);
