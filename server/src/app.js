import dotenv from "dotenv"
dotenv.config({path: "./.env"})
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
app.use(
    cors({
      origin: ["http://localhost:5173", "https://skillflow-frontend-client.onrender.com"], // Allow both local and deployed frontend
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(express.json())
app.use(cookieParser())


// APIs
import userRouter from "./routes/user.route.js"
import courseRouter from "./routes/course.route.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)



export default app

/* 

Deploy link: https://skillflow-frontend-client-lms.onrender.com/

*/