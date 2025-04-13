"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const validateToken = async (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        const user = await User_1.User.findById(verified.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Access denied, invalid token" });
    }
};
exports.validateToken = validateToken;
const validateAdmin = async (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        const user = await User_1.User.findById(verified.id);
        if (!user || !user.isAdmin) {
            res.status(403).json({ message: "Access denied." });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Access denied, invalid token" });
    }
};
exports.validateAdmin = validateAdmin;
exports.default = exports.validateToken;
