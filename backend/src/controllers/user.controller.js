import { User } from "../models/user.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        await User.create({
            name, email, password
        })

        return res.status(201).json({
            status: true,
            message: "User registered successfully."
        })
    }
    catch (err) {
        console.log(`user.controller.js --> register --> controller --> catch: ${err}`);
        return res.status(500).json({
            success: false,
            message: "Registration server error"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists!"
            })
        }

        const isPasswordMatch = await user.isPasswordCorrect(password)

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid user credentials!"
            })
        }

        const JWTtoken = await user.generateJWTtoken()
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        }

        return res.status(200).cookie("token", JWTtoken, options).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user
        })
    }
    catch (err) {
        console.log(`user.controller.js --> Login --> controller --> catch: ${err}`);
        return res.status(500).json({
            success: false,
            message: "Login server error"
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findById(id).select("-password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User profile found Successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const id = req.id
        const { name } = req.body
        const profilePhoto = req.file

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0] // Extract public ID

            // console.log(user.photoUrl.split('/')) ;
            // console.log(` --> `, publicId) ;

            await deleteMediaFromCloudinary(publicId)
        }

        const cloudResponse = await uploadMedia(profilePhoto.path)

        if (!cloudResponse) {
            return res.status(500).json({
                success: false,
                message: "Fail to upload file at cloudinary!!"
            })
        }

        const photoUrl = cloudResponse.secure_url

        const updatedData = { name, photoUrl }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
            new: true
        }).select("-password")

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        })
    }
}