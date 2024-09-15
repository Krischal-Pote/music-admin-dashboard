import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongo";

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db("music");

  try {
    const songs = await db.collection("songs").find({}).toArray();
    const artistIds = songs.map((song) => song.artistId);
    console.log("artistIds", artistIds);

    const artists = await db
      .collection("artists")
      .find({ _id: { $in: artistIds } })
      .toArray();
    console.log("artists", artists);
    // Merging artist data with songs
    const songsWithArtist = songs.map((song) => {
      const artist = artists.find(
        (artist) => artist._id.toString() === song.artistId
      );
      return {
        ...song,
        artistName: artist ? artist.name : "Unknown Artist",
        album: artist ? artist.album : "Unknown Album",
        releaseDate: artist ? artist.releaseDate : "Unknown Release Date",
      };
    });

    return NextResponse.json(
      { success: true, songs: songsWithArtist },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
