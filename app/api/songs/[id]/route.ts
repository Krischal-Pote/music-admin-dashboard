import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongo";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid song ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("music");

    const result = await db
      .collection("songs")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid song ID format" },
        { status: 400 }
      );
    }

    const songData = await request.json();

    const client = await clientPromise;
    const db = client.db("music");

    const result = await db
      .collection("songs")
      .updateOne({ _id: new ObjectId(id) }, { $set: songData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated: songData });
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }
}
