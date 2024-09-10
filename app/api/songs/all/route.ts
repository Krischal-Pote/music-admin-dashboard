import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const client = await clientPromise;
    const db = client.db("music");

    try {
      const songs = await db.collection("songs").find({}).toArray();
      res.status(200).json({ songs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  } else {
    // Method Not Allowed
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
