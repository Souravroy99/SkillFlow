import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
const corsOptions = {
    // ["http://localhost:5173", 'https://frontend-skillflow.onrender.com'], // Allow both local and deployed frontend
      origin: process.env.CORS_ORIGIN, 
      credentials: true,
  }

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())


// APIs
import userRouter from "./routes/user.route.js"
// import courseRouter from "./routes/course.route.js"

app.use("/api/v1/user", userRouter)
// app.use("/api/v1/course", courseRouter)



export default app
  
// Deployed: https://frontend-skillflow.onrender.com