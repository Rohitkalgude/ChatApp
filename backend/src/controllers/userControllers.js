import { User } from "../models/User.js";
import cloudinary from "../services/Cloudinary.js";
import { transporter } from "../services/nodemailer.js";

const UserRegister = async (req, res) => {
   try {
      const { fullName, email, password } = req.body;

      // Check required fields
      if (!fullName || !email || !password) {
         return res.status(400).json({
            success: false,
            message: "All fields are required",
         });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User already exists",
         });
      }

      // Generate OTP
      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Create new user
      const newUser = await User.create({
         fullName,
         email,
         password,
         emailOtp,
         emailOtpExpiry,
      });

      // Send OTP via email
      transporter
         .sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to ChatApp - Verify Your Account",
            text: `🎉 Welcome ${fullName}!\nYour OTP is: ${emailOtp}. Valid for 10 minutes.`,
         })
         .catch((err) => console.log("Email error:", err.message));

      // Success response
      return res.status(201).json({
         success: true,
         message: "User registered successfully. OTP sent to email.",
         data: {
            fullName: newUser.fullName,
            email: newUser.email,
         },
      });
   } catch (error) {
      console.log("Error in user registration:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

const Login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) {
         return res.status(401).json({
            success: false,
            message: "Wrong password",
         });
      }

      const token = user.generateToken();
      console.log("Genrate Token", token);

      res.cookie("accessToken", token, {
         httpOnly: true,
         secure: false,
         sameSite: "lax",
      });

      return res.status(200).json({
         success: true,
         message: "Login successful",
         data: {
            token,
            user,
         },
      });
   } catch (error) {
      console.log("Error in user login:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

const CurrentUser = async (req, res) => {
   try {
      if (!req.user) {
         return res
            .status(401)
            .json({ success: false, message: "Not authorized" });
      }

      return res.status(200).json({
         success: true,
         message: "Current user featch",
         user: req.user,
      });
   } catch (error) {
      console.log("Error in current user:", error.message);
      return res.status(500).json({ success: false, message: "Server false" });
   }
};

const Logout = async (req, res) => {
   try {
      res.clearCookie("accessToken", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res
         .status(200)
         .json({ success: true, message: "Logout Successfully" });
   } catch (error) {
      console.log("Error in current user:", error.message);
      return res.status(500).json({ success: false, message: "Server false" });
   }
};

const verifyOtp = async (req, res) => {
   try {
      const { emailOtp } = req.body;

      if (!emailOtp) {
         return res
            .status(400)
            .json({ success: false, message: "OTP is required" });
      }

      const user = await User.findOne({ emailOtp: Number(emailOtp) });

      if (!user) {
         return res
            .status(404)
            .json({ success: false, message: "Invalid OTP" });
      }

      if (user.isverified) {
         return res
            .status(400)
            .json({ success: false, message: "User already verified" });
      }

      if (user.emailOtp !== Number(emailOtp)) {
         return res
            .status(400)
            .json({ success: false, message: "Invalid OTP" });
      }

      if (user.emailOtpExpiry < new Date()) {
         return res
            .status(400)
            .json({ success: false, message: "OTP expired" });
      }

      user.isverified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();

      const token = user.generateToken();
      return res.status(200).json({
         success: true,
         message: "OTP verified successfully",
         user,
         token,
      });
   } catch (error) {
      console.log("Error in current user:", error.message);
      return res.status(500).json({ success: false, message: "Server false" });
   }
};

const resendOtp = async (req, res) => {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required",
         });
      }

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      if (user.isverified) {
         return res.status(400).json({
            success: false,
            message: "User already verified",
         });
      }

      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.emailOtp = emailOtp;
      user.emailOtpExpiry = emailOtpExpiry;

      await user.save();

      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: email,
         subject: "Resend OTP - ChatApp Verification",
         text: `Your new OTP is: ${emailOtp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({
         success: true,
         message: "OTP resent successfully",
         email,
      });
   } catch (error) {
      console.log("Error in resend OTP:", error.message);
      return res.status(500).json({ success: false, message: "Server false" });
   }
};

const requestPasswordReset = async (req, res) => {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required",
         });
      }

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.emailOtp = emailOtp;
      user.emailOtpExpiry = emailOtpExpiry;
      await user.save();

      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: email,
         subject: "ChatApp - Password Reset OTP",
         text: `Hello ${user.fullName || ""},\n\nYou requested to reset your password.\n\nYour OTP is: ${emailOtp}\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
         success: true,
         message: "OTP sent to your email",
         email: user.email,
         fullName: user.fullName,
      });
   } catch (error) {
      console.log("Error in password reset request:", error.message);
      return res.status(500).json({ success: false, message: "Server false" });
   }
};

const passwordOtp = async (req, res) => {
   try {
      const { emailOtp } = req.body;

      if (!emailOtp) {
         return res.status(400).json({
            success: false,
            message: "OTP is required",
         });
      }

      const user = await User.findOne({ emailOtp });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      if (
         user.emailOtp !== Number(emailOtp) ||
         user.emailOtpExpiry < new Date()
      ) {
         return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
         });
      }

      return res.status(200).json({
         success: true,
         message: "OTP verified successfully",
         email: user.email,
      });
   } catch (error) {
      console.log("Error in password OTP verify:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

const NewPassword = async (req, res) => {
   try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Email and new password are required",
         });
      }

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      user.password = newPassword;
      user.emailOtp = null;
      user.emailOtpExpiry = null;

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Password changed successfully",
      });
   } catch (error) {
      console.log("Error in new password:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

const updateProfile = async (req, res) => {
   try {
      const { fullName, bio, profilePic } = req.body;
      const userId = req.user._id;

      if (!userId) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      let updatedUser;

      if (profilePic) {
         const upload = await cloudinary.uploader.upload(profilePic);
         updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, bio, profilePic: upload.secure_url },
            { new: true }
         );
      } else {
         updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, bio },
            { new: true }
         );
      }

      return res.status(200).json({
         success: true,
         message: "Profile updated successfully",
         data: {
            user: updatedUser,
         },
      });
   } catch (error) {
      console.log("Update Profile Error:", error.message);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export {
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
};
