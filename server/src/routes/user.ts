import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Board } from "../models/Board";
import mongoose, { Document, Schema, Types } from "mongoose";


const router: Router = Router();

/*Registering users with specific criterias such as seeing if name
is already used. Hashing password before storing it in database.*/
router.post("/register",
body("username").trim().isLength({ min: 3 }).escape(),
  body("password").isLength({ min: 5 }),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const existingUser = await User.findOne({ username: req.body.username });

      if (existingUser) {
        res.status(403).json({ username: "Username already in use" });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = await User.create({
        username: req.body.username,
        password: hash,
      });

      console.log("New user created:", newUser);
      console.log("New user ID:", newUser._id);

      const newBoard = await Board.create({
        user: newUser._id,
        title: "Default",
        columns: [],
      });

      const jwtPayload = {
        id: newUser._id,
        username: newUser.username,
      };
      //JTW token is valid for 2 hours
      const token = jwt.sign(jwtPayload, process.env.SECRET as string, {
        expiresIn: "2h",
      });

      res.status(200).json({ token, boards: [newBoard._id] });

    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
)

router.post("/login",
  body("username").trim().escape(),
  body("password").escape(),
  async (req: Request, res: Response): Promise<void> => {

    /*Extracting username and password from request body
    Finding username from database and comparing provided password
    with the hashed password*/
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        res.status(401).json({ message: "Login failed" });
        return;
      }

      if (bcrypt.compareSync(req.body.password, user.password)) {
        const jwtPayload = {
          id: user._id,
          username: user.username,
        };

        const token = jwt.sign(jwtPayload, process.env.SECRET as string, {
          expiresIn: "2h",
        });

        const boards = await Board.find({ user: user._id });

        res.status(200).json({
          success: true,
          token,
          boards: boards.map((board) => board._id),
        });
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);



export default router;
