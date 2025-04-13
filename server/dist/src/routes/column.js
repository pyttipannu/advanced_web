"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
const Board_1 = require("../models/Board");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
//Creating a new column in a board
router.post("/addColumn", validateToken_1.validateToken, async (req, res) => {
    try {
        //Finding users board based on userId
        const board = await Board_1.Board.findOne({ user: req.user?.id });
        if (!board) {
            res.status(404).json({ message: "Board not found for this user" });
            return;
        }
        const newColumn = new Column_1.Column({ userId: req.user?.id, title: req.body.title });
        await newColumn.save();
        board.columns.push(newColumn._id);
        await board.save();
        res.status(201).json(newColumn);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating column", error });
    }
});
//Fetching user's columns and their cards inside
router.get("/board", validateToken_1.validateToken, async (req, res) => {
    console.log(req.user?.id);
    //Finding user's all columns
    try {
        const columns = await Column_1.Column.find({ userId: req.user?.id });
        if (!columns || columns.length === 0) {
            res.status(404).json({ message: "No columns found for this user.. yet...." });
            return;
        }
        //Finding all the cards and adding them to their column with one search
        const columnsWithCards = await Promise.all(columns.map(async (column) => {
            let cardObjects = [];
            for (const cardId of column.cards) {
                let card = await Card_1.Card.findById(cardId);
                if (card) {
                    cardObjects.push(card);
                }
            }
            console.log(cardObjects);
            return { ...column.toObject(), cardObjects };
        }));
        //console.log(columnsWithCards)
        res.json(columnsWithCards);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching columns", error });
    }
});
router.post("/addCard", validateToken_1.validateToken, async (req, res) => {
    try {
        console.log(req.body);
        //Findinding the right column
        const column = await Column_1.Column.findById(req.body.columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found for this user" });
            return;
        }
        const newCard = new Card_1.Card({ title: req.body.title, description: req.body.description });
        await newCard.save();
        column.cards.push(newCard._id);
        await column.save();
        res.status(201).json(newCard);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating card", error });
    }
});
router.delete("/deleteCard/:cardId", validateToken_1.validateToken, async (req, res) => {
    try {
        const { cardId } = req.params;
        //Finding the card we want to delete
        const card = await Card_1.Card.findById(cardId);
        if (!card) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        //Finding the column where the card is
        const column = await Column_1.Column.findOne({ cards: cardId });
        if (column) {
            column.cards = column.cards.filter(id => id.toString() !== cardId);
            await column.save();
        }
        await Card_1.Card.findByIdAndDelete(cardId);
        res.status(200).json({ message: "Card deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting card", error });
    }
});
router.delete("/deleteColumn/:columnId", validateToken_1.validateToken, async (req, res) => {
    try {
        const { columnId } = req.params;
        //Finding right column
        const column = await Column_1.Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        await Board_1.Board.updateOne({ user: req.user?.id }, { $pull: { columns: columnId } });
        await Column_1.Column.findByIdAndDelete(columnId);
        res.status(200).json({ message: "Column deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting column", error });
    }
});
router.post("/changeTitle", validateToken_1.validateToken, async (req, res) => {
    try {
        const { columnId, newTitle } = req.body;
        const column = await Column_1.Column.findById(columnId);
        if (!column) {
            res.status(404).json({ message: "Column not found" });
            return;
        }
        column.title = newTitle;
        await column.save();
        res.status(200).json(column);
    }
    catch (error) {
        res.status(500).json({ message: "Error changing title", error });
    }
});
router.post('/moveCard', validateToken_1.validateToken, async (req, res) => {
    const { cardId, fromColumnId } = req.body;
    try {
        const card = await Card_1.Card.findById(cardId);
        if (!card) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        //Finding users own columns
        const userId = req.user?.id;
        const columns = await Column_1.Column.find({ userId: userId });
        if (columns.length === 0) {
            res.status(404).json({ message: "No columns found" });
            return;
        }
        const fromColumn = columns.find((col) => col._id.toString() === fromColumnId);
        if (!fromColumn) {
            res.status(404).json({ message: "Source column not found" });
            return;
        }
        let currentColumnIndex = columns.findIndex((col) => col._id.toString() === fromColumnId);
        if (currentColumnIndex === -1) {
            res.status(404).json({ message: "Source column not found in columns" });
            return;
        }
        //Finding the next column
        let nextColumnIndex = (currentColumnIndex + 1) % columns.length;
        let nextColumn = columns[nextColumnIndex];
        fromColumn.cards = fromColumn.cards.filter((cardObjectId) => cardObjectId.toString() !== cardId);
        await fromColumn.save();
        nextColumn.cards.push(card._id);
        await nextColumn.save();
        res.status(200).json({
            message: "Card moved successfully",
            nextColumnId: nextColumn._id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to move card", error });
    }
});
exports.default = router;
