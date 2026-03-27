import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the Interface for a Post document
export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string; // Optional field
  coverImage?: string; // Optional field
  author: mongoose.Types.ObjectId;
  categories: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxLength: 200,
    },
    coverImage: String,
    
    // RELATIONSHIP: Connect this post to a User
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    categories: [String],
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 2. Export the Model with the IPost type applied
const Post: Model<IPost> = 
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
