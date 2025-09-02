import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}

app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())


// APIs 
import userRouter from "./routes/user.route.js"
import courseRouter from "./routes/course.route.js"
import mediaRouter from "./routes/videoUpload.route.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/media", mediaRouter)


export default app