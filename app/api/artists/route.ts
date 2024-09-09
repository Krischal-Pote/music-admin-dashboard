import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db("music");

  try {
    const totalArtists = await db.collection("artists").countDocuments();
    const artists = await db
      .collection("artists")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalArtists / limit);

    return NextResponse.json({ artists, totalPages });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const artistData = await request.json();

    // Validate required fields
    if (!artistData.name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("music");

    const artist = {
      name: artistData.name,
      dob: artistData.dob,
      gender: artistData.gender,
      address: artistData.address,
      first_release_year: artistData.first_release_year,
      no_of_albums_released: artistData.no_of_albums_released,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the new artist into the database
    await db.collection("artists").insertOne({
      ...artist,
    });

    // Return the newly created artist
    return NextResponse.json(
      { success: true, artist: artist },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating artist:", error); // Log the error for debugging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create artist",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
