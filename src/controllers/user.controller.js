import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js";



const registerUser = asyncHandler(async (req, res) => {
   //get user deatils from fronted 
   //Validation - not empty 
   //check if user already exists -email, usernaem , your choice 
   //check for images and for avatar 
   //upload them  to cloudinary ,avatar check   
   //user object bec of mongodb -- create entry in db 
   //remove password and referesh token filed from response 
   //check for user creation 
   //return responsef


   //1

  const {fullName , email , username , password} = req.body
  console.log(( "email", email));

  if (
    [fullName, email, username, password].some((field) => field?.trim () === "")
   ){
      throw new  ApiError(400,"Full name is required")
  }
  
 const existedUser =  User.findOne({
    $or: [{ username },{ email } ],
  })
    if (existedUser) {
      throw new ApiError(409, "User with email or username alreday exists");
    }
    
   const avatarLocalPath = req.files?.avatar [0]?.path;
    const coverImageLocalPath = req.files?.coverImage [0]?.path;
   
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   
    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar");
    }



export { registerUser };