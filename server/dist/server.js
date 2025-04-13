"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./src/routes/user"));
const column_1 = __importDefault(require("./src/routes/column"));
const cors_1 = __importDefault(require("cors"));
//import bcrypt from "bcryptjs";
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/user", user_1.default);
app.use("/column", column_1.default);
app.listen(port, () => {
    console.log(`Servu pyörii ${port}`);
});
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
