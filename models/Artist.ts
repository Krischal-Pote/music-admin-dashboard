import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtist extends Document {
  name: string;
  dob?: Date;
  gender?: "m" | "f" | "o";
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
  created_at: Date;
  updated_at: Date;
}

const artistSchema: Schema<IArtist> = new Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["m", "f", "o"] },
  address: { type: String },
  first_release_year: { type: Number },
  no_of_albums_released: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Artist: Model<IArtist> =
  mongoose.models.Artist || mongoose.model<IArtist>("Artist", artistSchema);
