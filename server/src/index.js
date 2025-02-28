import {connectDB} from "./db/index.js"
import app from "./app.js"

connectDB()
.then(() => {
    const PORT = process.env.PORT || 4001
    app.on("error", (error) => {
        console.log("ERR: ", error); 
    })

    app.listen(PORT, () => {
        console.log(`Server is running at: ${PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB Connection Failed!!!: `, err);
})