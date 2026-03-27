import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the Interface for a Comment document
export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // Who wrote it?
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which post is it on?
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

// 2. Handle the "already defined" model check for Next.js hot-reloading
const Comment: Model<IComment> = 
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
