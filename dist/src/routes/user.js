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
const validateToken_1 = require("../middleware/validateToken");
const inputValidation_1 = require("../validators/inputValidation");
const validateToken_2 = require("../middleware/validateToken");
const Board_1 = __importDefault(require("../models/Board"));
const router = (0, express_1.Router)();
router.post('/api/user/register', inputValidation_1.validateRegisterInput, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password, username, isAdmin = false } = req.body;
    try {
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(403).json({ message: 'Email already in use' });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        const newUser = new User_1.User({
            username,
            email,
            password: hashedPassword,
            isAdmin,
        });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post("/api/user/login", (0, express_validator_1.body)("email").trim().escape(), (0, express_validator_1.body)("password").escape(), async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Login failed" });
            return;
        }
        if (bcrypt_1.default.compareSync(password, user.password)) {
            const jwtPayload = {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin,
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "2h" });
            res.status(200).json({ success: true, token });
            return;
        }
        res.status(401).json({ message: "Login failed" });
        return;
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Get all boards for the authenticated user
router.get('/api/boards', validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const boards = await Board_1.default.find({ user: userId }).populate('columns');
        res.status(200).json(boards);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching boards' });
    }
});
router.post('/api/board', validateToken_1.validateToken, async (req, res) => {
    const { title } = req.body;
    const userId = req.user?.id;
    try {
        const newBoard = new Board_1.default({
            title,
            user: userId,
            columns: [],
        });
        await newBoard.save();
        res.status(200).json(newBoard);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating board' });
    }
});
router.delete('/api/board/:id', validateToken_2.validateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Board_1.default.findByIdAndDelete(id);
        res.json({ message: 'Board deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting board' });
    }
});
exports.default = router;
