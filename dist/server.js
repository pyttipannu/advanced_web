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
//import bcrypt from "bcryptjs";
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 3000;
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/", user_1.default);
app.listen(port, () => {
    console.log(`Servu pyörii ${port}`);
});
/*tarvitut setit
npm install express path morgan mongoose dotenv
npm i dotenv bcrypt jsonwebtoken
npm i express-validator
npm install -D typescript ts-node @types/node @types/express @types/morgan @types/mongoose

npm start
*/ 
