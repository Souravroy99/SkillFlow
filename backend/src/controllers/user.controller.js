import { User } from "../models/user.model.js"

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
        return res.status(500).json({success: false, message: "Failed to Login", error})
    }
}