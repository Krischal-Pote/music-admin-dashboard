import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const client = await clientPromise;
    const db = client.db("music");
    const { artists } = await req.json(); // CSV data from frontend
    const collection = db.collection("artists");

    if (!artists) {
      return NextResponse.json(
        { error: "No artists provided" },
        { status: 400 }
      );
    }

    console.log("artists", artists);

    // Insert the CSV data into the 'artists' collection
    const result = await collection.insertMany(artists);

    return NextResponse.json(
      { success: true, insertedCount: result.insertedCount },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to import artists" },
      { status: 500 }
    );
  }
}
