import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import  {sendEmail}  from "../utils/sendEmail.js";

// Load environment variables
dotenv.config();

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const signUpWithGoogle = asyncHandler(async (req, res) => {
    try {
        const { email, name, picture } = req.body;

        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            user = await User.create({
                email,
                fullName: name,
                mobileNumber: null,
                password: crypto.randomBytes(32).toString("hex"), // Generate a random password
                image: picture,
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Google sign in successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image, // Fixed
            },
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.error("Error during Google sign in:", err);
        throw new ApiError(500, "Something went wrong while signing in with Google");
    }
});


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, mobileNumber, password, confirmPassword } = req.body;

    // Check if required fields are provided
    if ([fullName, email, password, confirmPassword].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists by email or mobileNumber
    const existedUser = await User.findOne({
        $or: [{ mobileNumber }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or mobile number already exists");
    }

    if (confirmPassword !== password) {
        throw new ApiError(400, "Password and Confirm Password must match");
    }

    const user = await User.create({
        fullName,
        email,
        mobileNumber,
        password,
    });

    // Find the created user and exclude sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Handle any error if the user is not created
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return the successful response with status 201
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, mobileNumber, password } = req.body;

    // Check if email or mobileNumber is provided
    if (!(email || mobileNumber)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
    $or: [
        { email: email },
        { mobileNumber: mobileNumber }
    ]
}).select("+password");

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});


const forgotPassword = asyncHandler(async (req, res) => {
    const  {email} = req.body;

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 10 * 600 * 1000; // 10 minutes
    await user.save({validateBeforeSave: false});
    const resetUrl = `https://smart-home-backend-xyir.onrender.com/api/v1/user/reset-password/${resetToken}`;
    const message = `Reset your password by clicking on the link: ${resetUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        throw new ApiError(500, error.message);
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
  
    // Hash the token (because we saved it as hashed in DB)
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  
    // Find user with this token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // token still valid
    });
  
    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }
  
    // Check passwords match
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
  
    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  
    // Optionally generate new tokens or login the user
    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  });


const checkUser  = asyncHandler(async (req, res) =>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(200).json({
                success: true,
                message: "User exists",
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    image: user.image
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
    }
    } catch (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

})
  

export {
    registerUser,
    loginUser,
    signUpWithGoogle,
    forgotPassword,
    resetPassword,
    checkUser
};
