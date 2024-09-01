import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
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

export default mongoose.models.Music || mongoose.model("Music", musicSchema);
