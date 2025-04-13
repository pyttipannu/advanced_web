import mongoose, { Schema, Document, Types} from "mongoose";

interface ICard extends Document {
  title: string;
  description: string;
  columnId: Types.ObjectId;
}

const CardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Card = mongoose.model<ICard>("Card", CardSchema);

export { Card };
export type { ICard };
