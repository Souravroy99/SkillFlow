import { User } from "../models/user.model.js"
import { deleteMediaFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

export const register = async(req, res) => {
    try {
        const {name, email, password} = req.body    

        if(!name || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are required."})
        }

        const IsUserExists = await User.findOne({email})

        if(IsUserExists) {
            return res.status(400).json({success: false, message: "User already exists."})
        }

        const user = await User.create({name, email, password})

        return res.status(200).json({
                                    success: true, 
                                    message: "Account created successfully.", 
                                    user
                                })
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to register", error: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body 

        if(!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required."})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({success: false, message: "User does not exists."})
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid) {
            return res.status(401).json({success: false, message: "Invalid user credentials!"})
        }

        const loginUser = await User.findById(user._id).select("-password")

        const token = await user.generateJWTtoken()
        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }

        return res
            .status(200)
            .cookie("token", token, options)
            .json({
                success: true, 
                message: "Login successfully",
                user: loginUser
            }) 
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to login", error})
    }
}

export const logout = async(req, res) => {
    try {       
        const options = { 
            httpOnly: true,
            secure: true,
            maxAge: 0 
        }

        return res
                .status(200)
                .cookie("token", "", options)
                .json({success: true, message: "User logout successfully"})
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to logout", error: error.message})
    }
}

// Fetch user profile iff the user is logged in
export const getUserProfile = async(req, res) => {
    try {
        return res.status(200).json({success: true, message: "User found", user: req.user})
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to fetch user profile", error: error.message})
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { name } = req.body
        const user = req.user
        const profilePhotoLocalPath = req.file?.path 

        if(user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0]
            await deleteMediaFromCloudinary(publicId)
        }
 
        let photoRes ;
        if(profilePhotoLocalPath) {
            photoRes = await uploadOnCloudinary(profilePhotoLocalPath)
        }

        const updateData = { name }
        if(photoRes?.url) {
            updateData.photoUrl = photoRes.url
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {new: true}). select("-password")  // {new: true} --> This will pass the update user from DB

        return res
            .status(200)
            .json({
                success: true,
                message: "Profile successfully updated",
                user: updatedUser
            })
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to update profile", error: error.message})
    }
}