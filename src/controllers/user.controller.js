import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import {  User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshToken = async (userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

     //refresh token database save
       user.refreshToken =refreshToken;
       await user.save({validateBeforeSave:false})

    //return accessToken and refreshtoken
    return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"somthing went wrong while generating refresh and access token");
        
    }
}

const registerUser =asyncHandler (async(req,res)=>{
    //get user details from frontend
    //validation - not empty
    //check if user already exists:username and email
    //check for images ,check for avatar
    //upload them cloudinary,check avatar 
    //create user object -create entry in db 
    //remove password and refresh token field from response
    //check for user creation
    //return res

    //get user details from frontend
    const {username,email,fullname,password}=req.body
    //console.log("username",username);
    // console.log("email",email);
    // console.log("fullname",fullname)
    // console.log("password",password)


//validation - not empty
     //method 1
    // if(fullname===""){
    //    throw new ApiError(400,"fullname is required");
       
    // }

    //methode 2

    if (
        [username,email,fullname,password].some((field)=>field?.trim()=="")
    ) {
        throw new ApiError(400,"All feilds are required");
    }


    //check if user already exists:username and email
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User With email or username already exists");
        
    }


     //check for images ,check for avatar
     const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files);
     
    //console.log("avatar is render",avatarLocalPath);

     //const coverImageLocalPath=req.files?.coverImage[0]?.path;
     let coverImageLocalPath;
      if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
      }

     if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
     }
     

     //upload them cloudinary,check avatar 
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }



    //create user object -create entry in db 
   const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
 //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Somthing went wrong while resistering the user");
        
    }

    //return res

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user register successfull")
    )


})


const loginUser = asyncHandler(async(req,res)=>{
    //req body ->data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies
    //res succesfully login


    //req body ->data

    const {email,username,password} =req.body
 
    //username or email
    if (!username && !email) {
      throw new ApiError(400,"username password is required");
    }

    //find the user
    const user = await User.findOne({
        $or: [{username} , {email}]
    })

    if(!user){
      throw new ApiError(404,"User does not exist");
      
    }

    //password check

   const isPasswordValid = await user.isPasswordCorrect (password)
   
   if(!isPasswordValid){
     throw new ApiError(404," Invalid User credentials");
     
   }

    //access and refresh token
   const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser= await User.findById(user._id).select(" -password -refreshToken")

    
   //send cookies
   const options ={
     httpOnly:true,
     secure:true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
     new ApiResponse(
        200,
        {
            //for user  apne tarikese accesstoken and refreshToken  store karega . //this is a not good practice
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged in Successfully"
     )
   )
      
})



const logoutUser = asyncHandler( async (req, res) => {
    await  User.findByIdAndUpdate(
         req.user._id,
         {
          $set:{
                refreshToken:undefined// this removes the field from document
            }
         },
         {
            new:true,
         }
       )

      const options ={
        httpOnly:true,
        secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(200, {}, "User logedout Sucessfully")
      )   
      
})



const refreshAccessToken= asyncHandler(async(req, res)=>{;
    const incomingRefreshToken = req.cookies.refreshToken ||req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request");
    }


  try {
      const decodedToken=  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
      // make sure karle id genrateAccessToken Wala hona chahiye
      const user= await User.findById(decodedToken?._id)
  
      if(!user){
          throw new ApiError(401, "Invalid refresh Token");
      }
  
  
      //incomingRefreshToken and genrateRefreshToken  are match
  
      if(refreshAccessToken !== user?.refreshToken){
          throw new ApiError(401, "Refresh token is expired or used");
          
      }
  
  
      const options ={
          httpOnly:true,
          secure:true
      }
  
      const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  
      return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(200,
              {accessToken, refreshToken:newRefreshToken},
              "Access Token Refreshed"
          
          )
      )
  } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid refresh token");
    
  }

})






export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}