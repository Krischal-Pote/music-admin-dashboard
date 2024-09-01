import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["m", "f", "o"] },
  address: { type: String },
  first_release_year: { type: Number },
  no_of_albums_released: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Artist || mongoose.model("Artist", artistSchema);
