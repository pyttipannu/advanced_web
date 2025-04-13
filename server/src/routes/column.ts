import express, { Request, Response } from "express";
import mongoose, {Types} from "mongoose";
import { Column, IColumn } from "../models/Column";
import { Card, ICard } from "../models/Card";
import { Board, IBoard } from "../models/Board";
import { validateToken, CustomRequest } from "../middleware/validateToken";

const router = express.Router();

//Creating a new column in a board
router.post("/addColumn", validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try { 

    //Finding users board based on userId
    const board : IBoard | null = await Board.findOne({user: req.user?.id});
    if (!board) {
      res.status(404).json({ message: "Board not found for this user" });
      return;
    }
    const newColumn = new Column({userId: req.user?.id, title: req.body.title }); 
    await newColumn.save();

    board.columns.push(newColumn._id as mongoose.Types.ObjectId);
    await board.save();

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: "Error creating column", error });
  }
});


//Fetching user's columns and their cards inside
router.get("/board", validateToken, async (req: CustomRequest, res: Response): Promise<void> =>{
  console.log(req.user?.id)

  //Finding user's all columns
  try {
    const columns : IColumn[] | null = await Column.find({userId: req.user?.id});
    if (!columns || columns.length === 0) {
      res.status(404).json({ message: "No columns found for this user.. yet...." });
      return;

    }
    //Finding all the cards and adding them to their column with one search

    const columnsWithCards = await Promise.all(columns.map(async (column : IColumn) => {
      let cardObjects : ICard[]=[];
      for (const cardId of column.cards) {
        let card: ICard | null = await Card.findById(cardId);
  
        if (card) {
          cardObjects.push(card);
        }
      }
      console.log(cardObjects);

      return { ...column.toObject(), cardObjects };
      
    })); 
    //console.log(columnsWithCards)
    res.json(columnsWithCards);

  } catch (error) {
      res.status(500).json({ message: "Error fetching columns", error });
  }

});

router.post("/addCard", validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try { 
    console.log(req.body)
    //Findinding the right column
    const column : IColumn | null = await Column.findById(req.body.columnId);

    if (!column) {
      res.status(404).json({ message: "Column not found for this user" });
      return;
    }

    const newCard = new Card({title: req.body.title, description: req.body.description}); 
    await newCard.save();

    column.cards.push(newCard._id as mongoose.Types.ObjectId);
    await column.save();

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: "Error creating card", error });
  }
});

router.delete("/deleteCard/:cardId", validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    //Finding the card we want to delete
    const card: ICard | null = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    //Finding the column where the card is
    const column: IColumn | null = await Column.findOne({ cards: cardId });
    if (column) {
      column.cards = column.cards.filter(id => id.toString() !== cardId);
      await column.save();
    }
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error });
  }
});

router.delete("/deleteColumn/:columnId", validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { columnId } = req.params;
    //Finding right column
    const column = await Column.findById(columnId);
    if (!column) {
      res.status(404).json({ message: "Column not found" });
      return;
    }

    await Board.updateOne({ user: req.user?.id }, { $pull: { columns: columnId } });
    await Column.findByIdAndDelete(columnId);

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting column", error });
  }
});

router.post("/changeTitle", validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { columnId, newTitle } = req.body;
    const column: IColumn | null = await Column.findById(columnId);
    if (!column) {
      res.status(404).json({ message: "Column not found" });
      return;
    }
    column.title = newTitle;
    await column.save();
    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ message: "Error changing title", error });
  }
});

router.post('/moveCard', validateToken, async (req: CustomRequest, res: Response): Promise<void> => {
  const { cardId, fromColumnId } = req.body;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    //Finding users own columns
    const userId = req.user?.id;
    const columns = await Column.find({userId:userId });
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

    fromColumn.cards = fromColumn.cards.filter(
      (cardObjectId) => cardObjectId.toString() !== cardId
    );
    await fromColumn.save();

    nextColumn.cards.push(card._id as Types.ObjectId);
    await nextColumn.save();

    res.status(200).json({
      message: "Card moved successfully",
      nextColumnId: nextColumn._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to move card", error });
  }
});






export default router;
