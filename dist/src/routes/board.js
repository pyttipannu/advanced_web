"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Board_1 = __importDefault(require("../models/Board"));
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
router.post("/api/board", validateToken_1.validateToken, async (req, res) => {
    const { title } = req.body;
    const userId = req.user?.id;
    const newBoard = new Board_1.default({
        title,
        user: userId,
        columns: [],
    });
    await newBoard.save();
    res.status(200).json(newBoard);
});
// Get all boards of a user
router.get("/api/boards", validateToken_1.validateToken, async (req, res) => {
    const userId = req.user?.id;
    const boards = await Board_1.default.find({ user: userId }).populate("columns");
    res.json(boards);
});
// Add a new column to a board
router.post("/api/board/:boardId/column", validateToken_1.validateToken, async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const board = await Board_1.default.findById(boardId);
    if (!board) {
        res.status(404).json({ message: "theres no board name like that!" });
        return;
    }
    const newColumn = new Column_1.Column({
        title,
        board: boardId,
        cards: [],
    });
    await newColumn.save();
    board.columns.push(newColumn._id);
    await board.save();
    res.status(200).json(newColumn);
});
// Rename a column
router.put("/api/column/:columnId", validateToken_1.validateToken, async (req, res) => {
    const { columnId } = req.params;
    const { title } = req.body;
    const column = await Column_1.Column.findById(columnId);
    if (!column) {
        res.status(404).json({ message: "theres no column named like that!" });
        return;
    }
    column.title = title;
    await column.save();
    res.status(200).json(column);
});
// Delete a column
router.delete("/api/column/:columnId", validateToken_1.validateToken, async (req, res) => {
    const { columnId } = req.params;
    const column = await Column_1.Column.findById(columnId);
    if (!column) {
        res.status(404).json({ message: "theres no column named like that!" });
        return;
    }
    const board = await Board_1.default.findById(column.board);
    if (board) {
        board.columns = board.columns.filter((column) => column.toString() !== columnId);
        await board.save();
    }
    await column.deleteOne();
    res.json({ message: "Column deleted successfully" });
});
// Add a card to a column
router.post("/api/column/:columnId/card", validateToken_1.validateToken, async (req, res) => {
    const { columnId } = req.params;
    const { text } = req.body;
    const column = await Column_1.Column.findById(columnId);
    if (!column) {
        res.status(404).json({ message: "theres no column named like that!" });
        return;
    }
    const newCard = new Card_1.Card({
        text,
        column: columnId,
    });
    await newCard.save();
    column.cards.push(newCard._id);
    await column.save();
    res.status(200).json(newCard);
});
/* Move a card between columns
router.put("/api/card/:cardId/move", validateToken, async (req: CustomRequest, res: Response) => {
    const { cardId } = req.params;
    const { targetColumnId } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
        res.status(404).json({message: "theres no card named like that!" });
        return;
    }

    const targetColumn = await Column.findById(targetColumnId);
    if (!targetColumn) {
        res.status(404).json({message: "theres no column named like that!" });
        return;
    }

    const currentColumn = await Column.findById(card.column);
    if (currentColumn) {
        currentColumn.cards = currentColumn.cards.filter((existingCardId) => existingCardId !== cardId);
        await currentColumn.save();
    }

    targetColumn.cards.push(cardId);
    await targetColumn.save();

    card.column = targetColumnId;
    await card.save();

    res.status(200).json(card);
});


// Delete a card
router.delete("/api/card/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
    const card = await Card.findById(cardId);
    if (!card) {
        return res.status(404).json({ message: "Card not found" });
    }

    const column = await Column.findById(card.column);
    if (column) {
        column.cards = column.cards.filter((cardId) => cardId.toString() !== cardId);
        await column.save();
    }

    await card.deleteOne();
    res.json({ message: "Card deleted successfully" });
});

export default router; */ 
