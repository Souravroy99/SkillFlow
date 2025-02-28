import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            })
    }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
           })
        }

        req.id = decode.userId
        next()

    } catch (error) {
        console.log(error);
    }
}