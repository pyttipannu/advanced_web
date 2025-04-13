import express, {Express} from "express"
import { Request, Response } from 'express';
import path from "path"
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"
import userRouter from "./src/routes/user"
import columnRouter from "./src/routes/column"
import cors, { CorsOptions } from "cors"

//import bcrypt from "bcryptjs";


dotenv.config()
const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))



app.use(express.static(path.join(__dirname, "../public")))
app.use("/user", userRouter)
app.use("/column", columnRouter)


app.listen(port, () => {
    console.log(`Servu pyörii ${port}`)
})



/*tarvitut setit
npm install express path morgan mongoose dotenv
npm i dotenv bcrypt jsonwebtoken
npm i express-validator
npm install -D typescript ts-node @types/node @types/express @types/morgan @types/mongoose
npm i --save-dev @types/react
cd server > npm start
cd client > npm run dev
npm install --save-dev @types/react @types/react-dom
npm install --save-dev vite-plugin-css-modules chatgtp helped
npm install @vitejs/plugin-react --save-dev
npm i --save-dev @types/multer
npm install @types/cors --save-dev

*/