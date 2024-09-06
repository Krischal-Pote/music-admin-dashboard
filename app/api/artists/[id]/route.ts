import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongo";

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
