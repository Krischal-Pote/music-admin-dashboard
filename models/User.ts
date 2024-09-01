import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: Date;
  gender?: "m" | "f" | "o";
  address?: string;
  role: "super_admin" | "artist_manager" | "artist";
  created_at: Date;
  updated_at: Date;
}

const userSchema: Schema<IUser> = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["m", "f", "o"] },
  address: { type: String },
  role: {
    type: String,
    enum: ["super_admin", "artist_manager", "artist"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
