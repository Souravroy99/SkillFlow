import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs" 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", 'instructor'],
        default: "student",
        // required: true,
    },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    photoUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)    
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWTtoken = function () {
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY_TIME
        }
    )
}
 
export const User = mongoose.model("User", userSchema)