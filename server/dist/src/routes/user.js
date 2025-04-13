"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Board_1 = require("../models/Board");
const router = (0, express_1.Router)();
/*Registering users with specific criterias such as seeing if name
is already used. Hashing password before storing it in database.*/
router.post("/register", (0, express_validator_1.body)("username").trim().isLength({ min: 3 }).escape(), (0, express_validator_1.body)("password").isLength({ min: 5 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        if (existingUser) {
            res.status(403).json({ username: "Username already in use" });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        const newUser = await User_1.User.create({
            username: req.body.username,
            password: hash,
        });
        console.log("New user created:", newUser);
        console.log("New user ID:", newUser._id);
        const newBoard = await Board_1.Board.create({
            user: newUser._id,
            title: "Default",
            columns: [],
        });
        const jwtPayload = {
            id: newUser._id,
            username: newUser.username,
        };
        //JTW token is valid for 2 hours
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, {
            expiresIn: "2h",
        });
        res.status(200).json({ token, boards: [newBoard._id] });
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/login", (0, express_validator_1.body)("username").trim().escape(), (0, express_validator_1.body)("password").escape(), async (req, res) => {
    /*Extracting username and password from request body
    Finding username from database and comparing provided password
    with the hashed password*/
    try {
        const user = await User_1.User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json({ message: "Login failed" });
            return;
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                id: user._id,
                username: user.username,
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, {
                expiresIn: "2h",
            });
            const boards = await Board_1.Board.find({ user: user._id });
            res.status(200).json({
                success: true,
                token,
                boards: boards.map((board) => board._id),
            });
        }
        else {
            res.status(401).json({ message: "Login failed" });
        }
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
