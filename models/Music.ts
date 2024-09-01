import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMusic extends Document {
  artist_id: mongoose.Types.ObjectId;
  title: string;
  album_name?: string;
  genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  created_at: Date;
  updated_at: Date;
}

const musicSchema: Schema<IMusic> = new Schema({
  artist_id: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  title: { type: String, required: true },
  album_name: { type: String },
  genre: {
    type: String,
    enum: ["rnb", "country", "classic", "rock", "jazz"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Music: Model<IMusic> =
  mongoose.models.Music || mongoose.model<IMusic>("Music", musicSchema);
