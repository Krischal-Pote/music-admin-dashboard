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

  try {
    // Insert the new artist into the database
    const result = await db.collection("artists").insertOne({
      name: artistData.name,
      dob: artistData.dob,
      gender: artistData.gender,
      address: artistData.address,
      first_release_year: artistData.first_release_year,
      no_of_albums_released: artistData.no_of_albums_released,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(
      { success: true, artist: result.ops[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create artist" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("id");
  const updatedData = await request.json();

  if (!ObjectId.isValid(artistId)) {
    return NextResponse.json(
      { success: false, message: "Invalid artist ID" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("music");

  try {
    const result = await db
      .collection("artists")
      .updateOne(
        { _id: new ObjectId(artistId) },
        { $set: { ...updatedData, updated_at: new Date() } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No artist found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Artist updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update artist" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("id");

  if (!ObjectId.isValid(artistId)) {
    return NextResponse.json(
      { success: false, message: "Invalid artist ID" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("music");

  try {
    const result = await db
      .collection("artists")
      .deleteOne({ _id: new ObjectId(artistId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No artist found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Artist deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete artist" },
      { status: 500 }
    );
  }
}
