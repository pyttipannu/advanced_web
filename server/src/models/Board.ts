import mongoose, { Schema, Document } from "mongoose";

interface IBoard extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  columns: mongoose.Types.ObjectId[];
}

const BoardSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
});

const Board = mongoose.model<IBoard>("Board", BoardSchema);

export { Board };
export type { IBoard };
