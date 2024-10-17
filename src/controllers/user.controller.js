import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import {  User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    const {usename,email,fullname,password}=req.body
    console.log("email",email);

//validation - not empty
     //method 1
    // if(fullname===""){
    //    throw new ApiError(400,"fullname is required");
       
    // }

    //methode 2

    if (
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All feilds are required");
    }


    //check if user already exists:username and email
    const existedUser=User.findOne({
        $or:[{usename},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User With email or username already exists");
        
    }


     //check for images ,check for avatar
     const avatartLocalPath=req.files?.avatar[0]?.path
     console.log("avatar is render",avatartLocalPath);

     const coverImageLocalPath=req.files?.coverImage[0]?.path

     if(!avatartLocalPath){
        throw new ApiErrorError(400,"Avatar file is required");
     }
     

     //upload them cloudinary,check avatar 
    const avatar= await uploadOnCloudinary(avatartLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiErrorError(400,"Avatar file is required");
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
    const createdUser=await user.findById(user._id).select(
        "-password -refreshToken"
    )
 //check for user creation
    if(!createdUser){
        throw new ApiErrorError(500,"Somthing went wrong while resistering the user");
        
    }

    //return res

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user register successfull")
    )

})

export {registerUser}