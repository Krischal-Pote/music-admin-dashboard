import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const artistId = url.searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json(
      { success: false, message: "No artistId provided" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("music");

  try {
    const songs = await db
      .collection("songs")
      .find({ artistId: new ObjectId(artistId) })
      .toArray();
    return NextResponse.json({ success: true, songs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { artistId: string } }
) {
  try {
    const songData = await request.json();

    if (!songData.title || !songData.genre || !songData.artistId) {
      return NextResponse.json(
        { success: false, message: "Title, genre, and artistId are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("music");

    const newSong = {
      artistId: new ObjectId(songData.artistId), // Ensure artistId is correctly processed
      title: songData.title,
      album_name: songData.album_name || null,
      genre: songData.genre,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const insertResult = await db.collection("songs").insertOne(newSong);

    if (insertResult.acknowledged) {
      newSong._id = insertResult.insertedId;
    }

    return NextResponse.json({ success: true, song: newSong }, { status: 201 });
  } catch (error) {
    console.error("Error creating song:", error); // Log the server error
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create song",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
