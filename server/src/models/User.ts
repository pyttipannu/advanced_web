import mongoose, { Document, Schema, Types } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  boardId: Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: false,}
});

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export { User };
export type {IUser};
