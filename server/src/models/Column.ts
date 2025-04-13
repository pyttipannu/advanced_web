import mongoose, { Schema, Document , Types} from "mongoose";

interface IColumn extends Document {
  userId: string;
  title: string;
  cards: Types.ObjectId[];
  _id:Types.ObjectId;
}

const ColumnSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
});

const Column = mongoose.model<IColumn>("Column", ColumnSchema);

export { Column };
export type { IColumn };
