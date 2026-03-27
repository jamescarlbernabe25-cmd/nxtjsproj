import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  username?: string; // 1. Added '?' so TypeScript doesn't require it during signup
  role: "user" | "admin" | "editor";
  image?: string;
  bio?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 2. Added to prevent "Duplicate Email" casing issues
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    // We keep this commented out as you requested
    // username: { type: String, unique: true, sparse: true }, 
    
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    image: String,
    bio: String,
    
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
  },
  { timestamps: true }
);

const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
