import dbConnect from "@/utils/dbConnect";
import clientPromise from "../../../../lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const client = await clientPromise;
  const db = client.db("music");

  try {
    const users = await db.collection("users").find().toArray();
    console.log("line 51", users);
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
