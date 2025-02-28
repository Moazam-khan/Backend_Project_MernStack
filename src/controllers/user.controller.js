import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while Failed to generate access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Full name, email, username, and password are required"
    );
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const newUser = await User.create({
    fullName,
    email,
    username,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res.status(201).json({
    status: 200,
    data: createdUser,
    message: "User registered successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> se DAta le awo
  //username and email login

  // find the user
  //password check
  //access and refresh token genrate send to user
  //send cookkies

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User doest not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

  const LoggedInUser = await User.findById(user._id).
  select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200).cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
  200: 
  {
    user: LoggedInUser, accessToken, refreshToken,
    message: "User logged in successfully"
  }
  });

});

const logoutUser = asyncHandler(async (req, res) => {


  //clear cookies             
  //send response
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: 1 // this removes the field from document
        }
    },
    {
        new: true
    }
)

  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(0)

  }
  return res
  .status(200).cookie("accessToken", "", options)
  .cookie("refreshToken", "", options)
  .json({
    status: 200,
    message: "User logged out successfully"
  });
});

export { registerUser, loginUser , logoutUser };

// import { Router } from 'express';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import {ApiError} from "../utils/ApiError.js";
// import {User} from "../models/user.model.js";
// import{uploadOnCloudinary} from "../utils/cloudinary.js";

// const registerUser = asyncHandler(async (req, res) => {
//    //get user deatils from fronted
//    //Validation - not empty
//    //check if user already exists -email, usernaem , your choice
//    //check for images and for avatar
//    //upload them  to cloudinary ,avatar check
//    //user object bec of mongodb -- create entry in db
//    //remove password and referesh token filed from response
//    //check for user creation
//    //return responsef

//    //1

//   const {fullName , email , username , password} = req.body
//   console.log(( "email", email));

//   if (
//     [fullName, email, username, password].some((field) => field?.trim () === "")
//    ){
//       throw new  ApiError(400,"Full name is required")
//   }

//  const existedUser = await User.findOne({
//     $or: [{ username },{ email } ],
//   })
//     if (existedUser) {
//       throw new ApiError(409, "User with email or username alreday exists");
//     }

//    const avatarLocalPath = req.files?.avatar [0]?.path;
//     const coverImageLocalPath = req.files?.coverImage [0]?.path;

//     if (!avatarLocalPath) {
//       throw new ApiError(400, "Avatar is required");
//     }

//    const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//       throw new ApiError(500, "Failed to upload avatar");
//     }
//     User.create({
//       fullName,
//       email,
//       username,
//       password,
//       avatar: avatar.url,
//       coverImage : coverImage?.url || "",

//     });

//   const createdUser = await User.findById(User._id).select("-password -refreshToken")
//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user");
//     }
//     return res.status(201).json(
//         new ApiResponse(200,  createdUser, "User registered successfully")
// )
// });

// export { registerUser }
