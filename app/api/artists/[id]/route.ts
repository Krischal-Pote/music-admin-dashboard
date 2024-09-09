import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongo";

// Handle DELETE request
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const artistId = url.pathname.split("/").pop();

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

// Handle PUT request
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const artistId = params.id;
  const updatedData = await request.json();

  console.log("artist id", artistId);

  if (!artistId) {
    return NextResponse.json(
      { success: false, message: "artist id not provided" },
      { status: 400 }
    );
  }

  // if (!ObjectId.isValid(artistId)) {
  //   return NextResponse.json(
  //     { success: false, message: "Invalid artist ID" },
  //     { status: 400 }
  //   );
  // }

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
